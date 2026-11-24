# Cora: what they sell and every use case, explained simply

Source: cora.tech (English pages), read on 24 Nov 2026. Cora is a direct competitor: a smart locker for IT equipment plus software. All numbers below are their own marketing claims.

---

## First, the words (read this before anything else)

Imagine a company with 5,000 employees. Everyone has a laptop, a mouse, a charger, maybe a phone. The **IT department** is the team that buys, sets up, fixes and tracks all of it. Most of the jargon describes a step in that job.

| Word | What it really means |
|---|---|
| **Asset** | Any piece of equipment the company owns and wants to track, like a laptop, a monitor or a headset. "IT asset" is the same thing. |
| **End user** | The normal employee who uses the laptop. Not an IT person. |
| **Service desk / helpdesk** | The IT team people call or write to when something is broken or they need something. |
| **Ticket** | A digital note for every request or problem, e.g. "Anna's laptop won't start". IT works through tickets like a to-do list. |
| **ITSM tool** (IT Service Management) | The software where tickets live. Famous ones are ServiceNow, Jira Service Management and Matrix42. Think of it as IT's inbox and to-do list. |
| **Asset management** | Keeping a list of which device belongs to whom, where it is and how old it is. It's like a library catalogue for laptops. LISSA Asset is our asset management software. |
| **Staging** | Preparing a new laptop before the employee gets it: installing Windows, company apps, security settings and updates. A brand-new laptop from the shop is useless at a company until it has been "staged". It's like stocking a new kitchen before the chef arrives. |
| **Provisioning / imaging** | Roughly the same as staging. "Imaging" means copying a ready-made setup onto the laptop in one go. |
| **Personalisation** | The last step of staging: making the laptop belong to one specific person (their account, their email, their files). |
| **Rollout** | Giving new devices to many people at once. Example: "Windows 12 rollout" or "every employee gets a new laptop this spring". It's a big wave of handovers. |
| **Device exchange / swap** | Taking someone's old or broken device and giving them a replacement. |
| **Lifecycle** | The life of a device from purchase → use → repair → replacement → returned and wiped or recycled. Companies usually replace laptops every 3–5 years. |
| **Onboarding / offboarding** | A new employee joining (they need a laptop on day 1) and an employee leaving (the laptop must come back). |
| **Self-service** | The employee gets what they need themselves, without waiting for an IT person. A vending machine is self-service. |
| **Go-live** | The day the system officially starts being used by real employees. |
| **Integration** | Connecting two pieces of software so they talk to each other automatically, e.g. the locker tells the ticket software "Anna took a mouse". |
| **Badge / RFID** | The employee ID card people tap on doors. The locker can read it to know who is standing in front of it. |
| **Cost center** | The internal "account" a department's spending is charged to, e.g. Marketing pays for its own mice. |
| **Wake-on-LAN** | Switching a computer on remotely through its network cable, so IT can work on it without touching it. |
| **Audit-proof** | Every action is recorded so it can later be proven who took what and when. This matters for security and accounting. |

---

## What Cora is

- **The box:** a large locker with many small doors (compartments), a touch screen, and a scale in every compartment that weighs what's inside. It can hold up to 600 items. Each compartment can have power and a network cable, so a laptop inside can be charged and worked on.
- **The software:** a web platform that tracks everything and connects to the company's ticket tool (ServiceNow, Matrix42) or anything else through an API.
- **The service:** they help plan it, deliver it with their own truck, install it, and train the IT team.
- **Their pitch:** "IT hardware, always available", which they explain as a smart locker and a vending machine in one.
- **Their numbers:** 150+ lockers, 250,000 end users, 80% fewer on-site tasks for IT, pays back in 6 months, go live in 8 weeks.

---

## The use cases, one by one

### 1. Self-service withdrawal ("the IT vending machine")
**The problem:** Someone needs a new mouse. Today they write to IT, wait, and an IT person walks over with a mouse. That costs more in salary than the mouse is worth, and nobody records who got what.

**How it works with Cora:**
1. The employee walks to the locker and taps their ID card (or uses the app or their staff number).
2. The screen shows a little shop. Each person only sees what they're allowed to take; a developer might see more than an intern.
3. They pick "mouse". A door opens and they take it.
4. In the background, the locker creates a ticket automatically ("Anna took 1 mouse"), puts it on Anna's record, and can charge her department.
5. The scale in that compartment notices the weight dropped, so the stock count updates by itself.

**In one sentence:** a vending machine for office tech that does the paperwork by itself.

### 2. Click & Collect
**The problem:** Many companies have an internal web shop where employees order equipment. After ordering, someone still has to check stock, tell the employee it's ready and arrange a handover.

**How it works:**
1. The employee orders in the company web shop, the same one as before.
2. The shop checks whether the locker has it. If yes, it's reserved.
3. If a manager has to approve it first, the employee waits for approval. Once approved, they get a message with a PIN code and QR code.
4. They pick it up at the locker whenever they want. If there are several lockers, they're told which one is closest.
5. When stock runs low, the locker reorders automatically.

**In one sentence:** like picking up an online order from a parcel locker, but for work equipment.

### 3. Remote device staging (the one with the confusing word)
**The problem:** A new employee starts Monday. IT must take a laptop, set it up for that exact person (accounts, apps, security) and hand it over in person. That's stressful when the hire is last-minute, or when the employee works in another city where there's no IT person.

**How it works:**
1. Several laptops sit in the locker already half-prepared. Each compartment has power and a network cable, so the laptops stay charged and online while locked inside.
2. When someone new joins, IT finishes the setup remotely from their desk. They wake the laptop over the network (Wake-on-LAN) and make it "Anna's laptop". Nobody touches it.
3. Anna gets a message, "your laptop is ready", and picks it up at the locker with her ID card.
4. A scanner reads the laptop's serial number as it comes out, so the system records that this exact laptop now belongs to Anna.
5. **Remote repair:** if Anna's laptop breaks, IT asks her to put it into the locker. It's plugged into power and network there, so IT can try to fix or reset it from a distance, and she picks it up again later.

**In one sentence:** IT prepares and even repairs laptops inside the locker without ever being in the same building.

### 4. IT Service Point (an extra, always-open IT counter)
**The problem:** Many offices have an IT counter (a "tech bar" or "walk-in") where people pick things up or get help. It's only open certain hours, and skilled IT staff spend their time handing out chargers instead of solving real problems.

**How it works:** the locker stands next to (or replaces part of) the IT counter. Simple things like picking up, returning or borrowing equipment happen at the locker 24/7 with no staff. People still go to humans for complicated problems.

**Their example:** insurance company Baloise says handing out a device now takes under a minute.

**In one sentence:** the boring half of the IT counter, open all night.

### 5. Rental of assets (borrowing things)
**The problem:** Someone forgot their charger at home, or needs a projector or a spare laptop for a day. IT hands it over informally, nobody writes it down, and it never comes back.

**How it works:**
1. Items meant for lending are stored in the locker, with rules for each one: who may borrow it and for how long (e.g. a charger for 1 day).
2. The employee borrows it any time with their ID card.
3. Every loan is recorded. If it isn't returned on time, the system sends a reminder, then tells the employee's manager, or charges the department.
4. They bring it back to the locker.

**They also suggest non-IT uses:** car keys for company cars, measuring tools and meeting equipment.

**In one sentence:** a library for equipment that chases late returns by itself.

### 6. Warehouse management & filling (keeping it stocked)
**The problem:** Branch offices often keep a messy cupboard of spare equipment, or order things one at a time. Someone has to count stock, write it down and reorder.

**How it works:**
1. The locker becomes the stock room. It holds up to 600 items and is open 24/7, even at sites with no IT staff.
2. Each item type is weighed once. After that, the scale knows how many are left just from the weight.
3. For each item you set a minimum, e.g. "always keep 5 chargers". When stock drops below it, the system either orders from the supplier automatically or tells IT.
4. Refilling is simple, about every two weeks, and anyone can do it. No IT knowledge is needed; the screen guides them.

**In one sentence:** the locker counts its own stock and reorders before it runs out.

### 7. Device lifecycle management (laptop rollout and device exchange)
**The problem:** Laptops get replaced every few years, and in a big company that's hundreds of swaps. Each swap means: give the new laptop, wait for the person to copy their files, get the old one back, wipe it, and update the records. Without a system, old laptops go missing (a security risk) and it takes forever.

**How it works:**
1. New laptops are loaded into the locker.
2. The system messages each employee: "your new laptop is ready".
3. The employee picks up the new laptop and has, say, a week to move their files over.
4. They drop the old laptop into the locker whenever it suits them.
5. IT is informed automatically, and the asset list is updated: the new laptop belongs to Anna, and the old one is back and ready to wipe or recycle.
6. IT, or even the supplier directly, refills the locker for the next wave.

**In one sentence:** the locker runs a big laptop swap as a pickup-and-drop-off point, and the records update themselves.

---

## How they talk about "go live in 8 weeks"

Their implementation page says it takes 8 weeks on average from first idea to go-live, in 3 phases:

1. **Solution design:** a workshop where they look at how the customer does things today, how many devices and sites there are, and which use cases to start with.
2. **Implementation:**
   - Connect the locker to the customer's ticket tool and ID card system.
   - Set up the items and use cases.
   - Test everything.
   - Train the IT team. They use "train the trainer": they train a few people, who train the rest.
3. **Delivery:**
   - They brand the locker in the customer's look (stickers, LED panel, screen design).
   - They deliver it with their own truck.
   - They install it, plug in power and network, and test it on site.

The short line "Go live in 8 weeks" appears on almost every use case page as a selling point.

---

## What this means for Spind (my reading)

- **Same territory:** our "Faulty device swap", "New device pickup", "EOL rollout", "Onboarding" and "Offboarding return" match their use cases 3, 5 and 7.
- **Use cases they show that we don't (yet):** an accessory vending machine (1), Click & Collect from a web shop (2), lending with reminders (5), and self-counting stock with automatic reordering (6).
- **What we say that they barely mention:** offboarding, meaning getting devices back when people leave. They don't have a page for it, and it's a real pain for IT, so it's worth keeping prominent.
- **Our 12 weeks vs their 8:** our timeline is longer, so the "Go live in 12 weeks" section should explain what happens in those weeks, so 12 feels thorough rather than slow. That's how the new Figma section is written.
- **Their page pattern** is worth copying for each use case:
  1. The problem today
  2. How it works, in 3–4 numbered steps
  3. Benefits with numbers
  4. A customer quote
  5. "Go live in X weeks"
  6. Book a call
