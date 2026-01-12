# P.A.T.H.O.S. Job Center

### Personal Automated Tracking & Hiring Optimization System

React-based dashboard for job search optimization featuring an ATS simulator, pipeline visualization, and resume optimizer.

## Features

* **Application Dashboard:** Visualizes application data via Sankey diagrams and activity metrics.
* **Pipeline:** Kanban-style tracking with stage management and visual timelines.
* **ATS Optimizer:** Client-side resume tailoring and cover letter generation using keyword analysis.
* **Master Profile:** Centralized editor for core professional data.

## Installation

**Clone repository**

```bash
git clone https://github.com/thedeutschmark/pathos.git
cd pathos
```

**Install Dependencies**
```bash
npm install
```
**Run Locally**
```bash
npm run dev
```
## Tech Stack

* React
* Vite
* Lucide-React

## System Logic
The optimizer utilizes regex patterns and keyword density analysis to simulate ATS scoring. All data processing occurs client-side.

