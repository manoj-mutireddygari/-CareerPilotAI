# CareerPilot AI - Complete Development Prompt

## Project Overview

Build a **modern, futuristic, AI-powered Career Automation Platform** named **CareerPilot AI**.

The application should have a premium UI similar to **Apple, Linear, Vercel, Stripe, and Arc Browser**, with beautiful animations, glassmorphism, gradients, and smooth interactions.

This is **not a CRUD application**.

The application should feel like an **AI Agent Platform** where users configure an autonomous career assistant that continuously searches for jobs, analyzes opportunities, optimizes resumes, and sends personalized recommendations.

---

# Problem Statement

Every day, students and job seekers repeat the same workflow:

* Search multiple job websites.
* Read hundreds of job descriptions.
* Check eligibility.
* Compare required skills.
* Modify resumes for ATS.
* Apply manually.

This repetitive workflow wastes hours every day and causes students to miss opportunities.

CareerPilot AI solves this by creating an autonomous AI Career Agent.

Users upload their resume only once.

The AI continuously works in the background.

---

# Tech Stack

Frontend

* React
* Vite
* Tailwind CSS
* GSAP
* Framer Motion
* Lenis Smooth Scroll
* React Flow
* Lucide Icons
* React Router

Backend

* Node.js
* Express.js

Database

* Firebase Firestore

Authentication

* Firebase Authentication

Storage

* Firebase Storage

Resume Parsing

* pdf-parse

Job Search

* SerpAPI (Google Jobs API)

Artificial Intelligence

* OpenAI GPT-5 or GPT-4.1 (or Gemini)

Scheduler

* node-cron

Email

* Nodemailer using Gmail SMTP

Deployment Ready

* Vercel (Frontend)
* Render/Railway (Backend)

---

# Design Requirements

The application must look futuristic.

Avoid traditional admin dashboard designs.

Use:

* Glassmorphism
* Soft shadows
* Floating cards
* Gradient backgrounds
* Aurora animations
* Smooth transitions
* Scroll animations
* Animated counters
* SVG line animations
* Blur effects
* Premium typography
* Large spacing
* Rounded UI
* Animated icons

The overall experience should feel like using an AI Operating System.

---

# Landing Page

The landing page should be fully animated using GSAP.

---

## Hero Section

Full screen.

Left Side

Large Heading

"Meet Your Autonomous AI Career Agent"

Subtitle

"Upload your resume once.

Your AI continuously discovers new opportunities, analyzes job descriptions, optimizes your resume, and delivers personalized job recommendations every day."

Buttons

* Start Free
* Watch Demo

Right Side

Instead of an image,

Create an animated workflow visualization

Resume

↓

AI Brain

↓

Jobs

↓

Resume Optimization

↓

Email

Every node should animate continuously.

Background

Animated gradient.

Floating particles.

Aurora effect.

---

## Trusted Companies Section

Display company logos.

Use logos from publicly available brand assets or icon libraries (e.g., Google, Microsoft, Amazon, Zoho, Infosys, TCS, Accenture) for presentation purposes.

Animate them on scroll.

---

## Problem Section

Show why job searching is repetitive.

Cards

Searching Jobs

↓

Reading Job Descriptions

↓

Editing Resume

↓

Checking ATS

↓

Applying

↓

Repeat Again Tomorrow

After animation,

Transform into

"One AI Agent Does Everything"

---

## Features Section

Animated cards.

Features

* AI Resume Analysis
* Daily Job Discovery
* ATS Resume Optimization
* Job Match Intelligence
* Gmail Notifications
* Automation Logs
* Resume Version History
* AI Skill Gap Analysis

---

## Interactive Workflow

Create a horizontal pipeline.

Resume Upload

↓

Resume Parser

↓

Skill Extraction

↓

Google Jobs API

↓

LLM Matching

↓

ATS Optimization

↓

Email

Each block should animate.

Connections should animate.

---

## Dashboard Preview

MacBook mockup.

Inside

Animated dashboard.

Show

Automation Running

Jobs Checked Today

Matched Jobs

Resume Generated

Emails Sent

Next Automation

---

## Testimonials

Animated cards.

---

## CTA

Large heading

"Stop Searching.

Start Automating."

---

# Authentication

Firebase Authentication

Support

* Email
* Password

---

# Dashboard

Modern AI Dashboard.

Sidebar

Dashboard

Automation

Jobs

Resume

Logs

Settings

Profile

---

# Dashboard Cards

Automation Status

Today's Jobs

Jobs Matched

Emails Sent

Resume Versions

Last Run

Next Run

---

# Automation Setup

User configures automation only once.

Fields

Upload Resume (PDF)

Preferred Domains

Examples

* AI Engineer
* ML Engineer
* Full Stack Developer
* Backend Developer
* Data Analyst

Preferred Locations

Expected Salary

Experience Level

Automation Time

Default

8:00 PM

SMTP Gmail

SMTP Email

SMTP App Password

Save Automation

---

# Manual Trigger

Provide

"Run Automation Now"

When clicked,

start automation immediately.

---

# Automation Pipeline

Use React Flow.

The pipeline should resemble n8n.

Nodes

Resume Uploaded

↓

Extract Resume

↓

Extract Skills

↓

Fetch Jobs

↓

Analyze Jobs

↓

Calculate Match Score

↓

Generate ATS Resume

↓

Generate Email

↓

Send Email

↓

Save Logs

Each node has states

Waiting

Running

Completed

Failed

During execution

Node color changes

Gray

↓

Blue

↓

Pulse

↓

Green

Show check mark when completed.

Connections animate while processing.

---

# Resume Processing

After upload

Extract text using pdf-parse.

Send extracted text to the LLM.

Prompt

Analyze the resume.

Extract

* Skills
* Projects
* Experience
* Education
* Technologies
* Preferred Roles

Return structured JSON.

Save result to Firestore.

---

# Daily Automation

Use node-cron.

Default schedule

Every day at 8 PM.

Manual trigger should also execute the same workflow.

---

# Job Collection

Use SerpAPI Google Jobs API.

Search using

Preferred Domains

Preferred Locations

Collect

* Company
* Role
* Description
* Apply Link
* Salary
* Posted Date

Save today's jobs.

---

# AI Job Matching

For every job

Send

Resume

*

Job Description

Prompt

Compare the candidate profile with the job description.

Return

* Match Score
* Why it matches
* Missing Skills
* Recommendation

Return JSON.

---

# Filtering

Ignore jobs

Match Score < 80%

Keep highest scoring jobs.

Top 3 recommended.

---

# ATS Resume Generator

Generate one optimized resume for each Top 3 jobs.

Rules

Never invent experience.

Improve wording.

Improve ATS keywords.

Improve bullet points.

Professional formatting.

---

# Email Generator

Generate

Subject

Today's AI Career Matches

Body

Company

Role

Match Score

Why You Match

Missing Skills

Apply Link

Attach optimized resume.

Send using Gmail SMTP.

---

# Logs

Every automation run should create logs.

Display

Start Time

End Time

Duration

Jobs Retrieved

Jobs Matched

Resumes Generated

Emails Sent

Errors

Expand each log.

Show every pipeline step.

---

# Live Activity Console

Create a terminal-style activity window.

Example

[20:00:00] Automation Started

[20:00:03] Resume Loaded

[20:00:06] Searching Jobs...

[20:00:10] 42 Jobs Retrieved

[20:00:18] Matching Jobs...

[20:00:31] ATS Resume Generated

[20:00:37] Email Created

[20:00:42] Email Sent Successfully

Automation Completed.

Animate every line.

---

# Firebase Collections

users

automation_settings

jobs

matched_jobs

resume_versions

automation_logs

emails

---

# Animations

Use GSAP extensively.

Hero animations

Scroll reveals

Stagger animations

Floating cards

Parallax

Number counters

Pipeline node animations

Button hover animations

Page transitions

Smooth scrolling

Loading animations

Progress animations

Terminal typing animation

Success check animations

Confetti after successful automation

---

# Images

Use high-quality royalty-free images from Unsplash or Pexels related to:

* Artificial Intelligence
* Software Developers
* Career Growth
* Recruitment
* Technology
* Automation
* Resume Analysis
* Job Search

Do not use random stock photos.

Use futuristic illustrations wherever possible.

---

# Final Goal

The application should feel like an intelligent AI platform rather than a job portal.

The user should feel they are assigning an autonomous AI agent to manage their career.

Every page should have premium animations, clean layouts, glassmorphism effects, and polished interactions. The project should be suitable for a final-year engineering showcase and demonstrate a complete AI-powered automation workflow.
