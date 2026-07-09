# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cena is a dish-first food discovery web app. The core idea: instead of discovering restaurants by name (like Google Maps or Yelp), users discover restaurants through the actual dishes on their menu. A user browses food items they're craving, finds the dish, and is led to the restaurant serving it — with the option to reserve a table.

### v1 Functional Requirements
- Users can create accounts, log in, and log out.
- Users see a Google-Maps-style interactive map of their local area.
- Users can search the map by food item/dish — not by restaurant name.
- Restaurants can onboard themselves by photo-scanning their menu (the system extracts dish names from the photo).
- Restaurants can attach images to individual menu items.

The backend is a FastAPI + SQLAlchemy service backed by PostgreSQL with PostGIS (for geospatial queries).

## Business Model

Cena's revenue comes primarily from the **restaurant (supply) side** — everyday diners are unlikely to pay a
subscription just for reservations, so restaurants pay first. Possible monetization streams:

- **Reservation commissions** — per-seated-cover fee charged to the restaurant for diners booked through Cena
  (OpenTable-style). Strongest fit because value is directly attributable.
- **Diner booking fee** — small fee to hold a table at high-demand restaurants (secondary, use sparingly).
- **Restaurant subscriptions (SaaS)** — free basic listing; paid tiers unlock menu photo-scanning, item images,
  and dish-demand analytics. The self-serve menu scan is the acquisition hook that feeds this upsell.
- **Promoted placement (ads)** — restaurants pay to rank higher for a given dish/cuisine/craving search
  (sponsored results). Requires diner traffic first; a later-stage stream.
- **Delivery/ordering commissions** — take a cut if in-app ordering is added (competes with DoorDash/UberEats).
- **Data & insights** — aggregate, anonymized dish-demand trends sold back to restaurants; needs scale and care
  around privacy.

Rollout sequence: (1) grow diner usage, (2) reservation commissions once booking volume exists,
(3) subscriptions / promoted placement once restaurants see they're getting customers. The self-serve menu-scan
onboarding exists to make growing the restaurant supply side cheap before revenue starts.

## Collaboration Style

The user is building this project to learn software development. **Do not write large blocks of code unprompted.** Write a few dozen lines at a time, explain what the code does and why, then ask questions to check understanding before moving on.

The user prefers to **type the code themselves** — give directions and explanations rather than writing files for them (config/scaffolding files like requirements or CLAUDE.md are fine to edit directly).

When walking through code, **include plain-language "read it as" explanations of what each line/construct actually does** — e.g. for `app.include_router(users.router)`, add: *"Read it as: take the `router` object defined inside the `users` module and attach all its endpoints to the app. Because that router has `prefix="/users"`, the signup endpoint becomes reachable at `POST /users/signup`."* Translate code into what it means, not just what it says.

## Development Setup

```bash
# Activate the venv (Windows)
backend\venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Run the development server (from project root)
uvicorn backend.app.main:app --reload
# or from inside backend/
uvicorn app.main:app --reload
```

The server reads `DATABASE_URL` from `backend/.env`. PostgreSQL must be running locally with the PostGIS extension enabled (required by the `Restaurant.location` geography column via `geoalchemy2`).

## Architecture

```
backend/app/
  main.py        # FastAPI app; calls Base.metadata.create_all on startup
  database.py    # SQLAlchemy engine, SessionLocal, Base, get_db() dependency
  models/        # ORM table definitions (SQLAlchemy)
  schemas/       # Pydantic request/response models (to be added)
  routers/       # FastAPI route handlers (to be added)
  services/      # Business logic layer (to be added)
```

**Data model relationships:**
- `User` — has `is_restaurant_owner` flag; UUIDs as PKs throughout
- `Restaurant` → `User` (owner_id FK); stores location as PostGIS `Geography(POINT, 4326)` for proximity queries; `hours` is JSON
- `MenuItem` → `Restaurant` (restaurant_id FK); `ingredients` is JSON; has `spice_level` (int) and `price` (Numeric)

**Key conventions:**
- All PKs are UUID (`postgresql.UUID`), generated via `uuid.uuid4`
- Timestamps use `DateTime(timezone=True)` defaulting to `datetime.now(timezone.utc)`
- New routers go in `routers/`, Pydantic schemas in `schemas/`, business logic in `services/`
- Use `get_db()` from `database.py` as a FastAPI dependency for DB sessions

## gstack

Use the `/browse` skill from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools.

Available gstack skills: `/office-hours`, `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`, `/design-consultation`, `/design-shotgun`, `/design-html`, `/review`, `/ship`, `/land-and-deploy`, `/canary`, `/benchmark`, `/browse`, `/connect-chrome`, `/qa`, `/qa-only`, `/design-review`, `/setup-browser-cookies`, `/setup-deploy`, `/setup-gbrain`, `/retro`, `/investigate`, `/document-release`, `/document-generate`, `/codex`, `/cso`, `/autoplan`, `/plan-devex-review`, `/devex-review`, `/careful`, `/freeze`, `/guard`, `/unfreeze`, `/gstack-upgrade`, `/learn`
