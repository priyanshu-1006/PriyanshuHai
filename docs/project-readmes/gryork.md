# Gryork Platform

## Bill Discounting Marketplace for Infrastructure Sector

Gryork is a comprehensive bill discounting platform that connects **EPCs (Buyers)**, **Sub-contractors (Sellers)**, and **NBFCs (Funders)** to enable quick liquidity for infrastructure project receivables.

---

## Platform Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           GRYORK ECOSYSTEM                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────────┐    GryLink     ┌─────────────┐                        │
│   │    Sales    │ ─────────────► │     EPC     │                        │
│   │    Team     │                │   (Buyer)   │                        │
│   └─────────────┘                └──────┬──────┘                        │
│                                         │                                │
│                                    Validates                             │
│                                         │                                │
│   ┌─────────────┐                ┌──────▼──────┐                        │
│   │     Ops     │ ◄───────────── │Sub-Contractor│                       │
│   │    Team     │   Verifies     │  (Seller)    │                       │
│   └─────────────┘                └──────┬──────┘                        │
│                                         │                                │
│                                    Submits Bills                         │
│                                         │                                │
│   ┌─────────────┐                ┌──────▼──────┐                        │
│   │     RMT     │ ─────────────► │    CWC     │                         │
│   │    Team     │   Assesses     │  Request    │                        │
│   └─────────────┘                └──────┬──────┘                        │
│                                         │                                │
│                                    Bids/Funds                            │
│                                         │                                │
│                                  ┌──────▼──────┐                        │
│                                  │    NBFC     │                        │
│                                  │  (Funder)   │                        │
│                                  └─────────────┘                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Business Flows

### Flow B (Primary) - EPC as Buyer

```
Sub-Contractor (Seller) ──► EPC (Buyer) ──► NBFC (Funder)
     │                           │               │
     │ Submits Bills             │ Validates     │ Provides
     │ Requests CWC              │ Sub-Con       │ Funding
     │                           │               │
     └───────────────────────────┴───────────────┘
```

### Flow A - EPC as Seller

```
EPC (Seller) ──► Client (Buyer) ──► NBFC (Funder)
```

---

## Repository Structure

```
Gryork/
├── README.md                    # This file
├── Docs/                        # Documentation
│   ├── Gryork Technical Design Document.md
│   ├── GryorkSOP.md
│   ├── state-machine.md
│   └── workflow.md
│
├── Gryork-backend/              # Monolithic Backend (Express.js)
│   ├── README.md
│   ├── src/
│   │   ├── index.ts             # Entry point
│   │   ├── routes/              # All API routes
│   │   ├── services/            # Business Logic
│   │   ├── middleware/          # Auth, Validation, etc.
│   │   └── lib/                 # Shared utilities
│   ├── packages/                # Shared packages (if applicable)
│   └── prisma/                  # Database Schema
│
├── Gryork/                      # Main Platform Frontend
│   └── README.md                # EPC & Sub-contractor Portal
│
├── Grylink/                     # EPC Onboarding Portal
│   └── README.md                # Tokenized Onboarding Flow
│
├── officials-portal/            # Internal Teams Portal
│   └── README.md                # Sales, Ops, RMT, Admin, Founders
│
└── Gryork-public/               # Public Marketing Website
    ├── README.md                # Page designs & structure
    └── BRAND_GUIDELINES.md      # Colors, typography, components
```

---

## Tech Stack

### Backend

| Component     | Technology                |
| ------------- | ------------------------- |
| Runtime       | Node.js 20+               |
| Framework     | Express.js (Monolith)     |
| Language      | TypeScript                |
| Database      | PostgreSQL                |
| Cache         | Redis                     |
| Message Queue | RabbitMQ / Kafka          |
| Storage       | S3-compatible (MinIO/AWS) |
| Auth          | JWT + RBAC                |

### Frontend

| Component  | Technology              |
| ---------- | ----------------------- |
| Framework  | Next.js 14 (App Router) |
| Language   | TypeScript              |
| Styling    | Tailwind CSS            |
| Components | shadcn/ui               |
| State      | Zustand + React Query   |
| Forms      | React Hook Form + Zod   |

---

## Frontend Applications

### 1. Gryork (Main Platform)

- **Users**: EPCs, Sub-contractors
- **Features**: Dashboard, Bill Management, CWC Requests, Chat
- **Path**: `/Gryork`

### 2. GryLink (Onboarding Portal)

- **Users**: EPCs (via tokenized links)
- **Features**: Single-use onboarding, Document upload
- **Path**: `/Grylink`

### 3. Officials Portal (Internal)

- **Users**: Sales, Ops, RMT, Admin, Founders
- **Features**: Lead management, Verification, Risk Assessment
- **Path**: `/officials-portal`

### 4. Gryork Public Website (Marketing)

- **Users**: Public, Potential NBFCs, Potential EPCs
- **Features**: Platform info, NBFC partnership forms, EPC contact forms
- **Path**: `/Gryork-public`
- **Theme**: Blue (#1E5AAF), Green (#22C55E), White

---

## Key Entities

| Entity             | Description                                             |
| ------------------ | ------------------------------------------------------- |
| **EPC**            | Engineering, Procurement & Construction company (Buyer) |
| **Sub-contractor** | Vendor/Seller working under EPC                         |
| **NBFC**           | Non-Banking Financial Company (Funder)                  |
| **Bill**           | Invoice from Sub-contractor to EPC                      |
| **CWC**            | Cumulative Working Capital request (bundle of bills)    |
| **GryLink**        | Tokenized onboarding link for EPCs                      |

---

## State Machines

### Company (EPC) States

```
LEAD → GryLink_Sent → CREDENTIALS_CREATED → DOCUMENTS_SUBMITTED
    → VERIFICATION_IN_PROGRESS → ACTIVE / REJECTED
```

### Sub-contractor States

```
ADDED_BY_EPC → INVITED → CREDENTIALS_CREATED → ACTIVE
```

### CWC States

```
DRAFT → SUBMITTED → UNDER_REVIEW → RMT_ASSESSMENT
    → SENT_TO_NBFC → BIDDING → NEGOTIATION → NBFC_ASSIGNED
    → FUNDED → REPAYMENT_PENDING → CLOSED
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Docker (optional)

### Development Setup

```bash
# Clone repository
git clone https://github.com/gryork/platform.git

# Backend
cd Gryork-backend
npm install
npm run dev

# Frontend (in separate terminals)
cd Gryork && npm install && npm run dev
cd Grylink && npm install && npm run dev
cd officials-portal && npm install && npm run dev
```

---

## Documentation

| Document                                                           | Description                   |
| ------------------------------------------------------------------ | ----------------------------- |
| [Technical Design](Docs/Gryork%20Technical%20Design%20Document.md) | Architecture & Design         |
| [SOP](Docs/GryorkSOP.md)                                           | Standard Operating Procedures |
| [State Machines](Docs/state-machine.md)                            | Entity State Transitions      |
| [Workflow](Docs/workflow.md)                                       | End-to-End Technical Flow     |

---

## Team Responsibilities

| Team         | Responsibilities                                               |
| ------------ | -------------------------------------------------------------- |
| **Sales**    | Lead generation, GryLink distribution, Sub-contractor outreach |
| **Ops**      | Document verification, KYC management, Bill verification       |
| **RMT**      | Risk assessment, NBFC reports, Override decisions              |
| **Admin**    | User management, NBFC management, System configuration         |
| **Founders** | High-value approvals (>₹1Cr), Strategic decisions              |

---

## License

Proprietary - Gryork Consultants Pvt Ltd

---

**Contact**: contact@gryork.com
