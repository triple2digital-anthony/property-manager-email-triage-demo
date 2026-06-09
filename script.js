const scenarios = [
  {
    id: "active-leak",
    from: "Jane Smith",
    subject: "Water coming through bathroom ceiling",
    preview:
      "Hi, water is coming through my bathroom ceiling at 4B. It is getting worse. Please help.",
    received: "Jun 9, 8:14 AM",
    building: "123 West 82nd Street",
    apartment: "4B",
    senderType: "Owner",
    priority: "P0 Emergency",
    category: "Repairs / Plumbing",
    status: "Escalated",
    owner: "Property Manager + Emergency Vendor",
    due: "Immediate",
    nextAction:
      "Call emergency support, dispatch plumber or super, ask for photos, and confirm access.",
    route: "Emergency process, then work-order tracking",
    missingInfo: ["Best phone number", "Access confirmation", "Photos or video"],
    reply:
      "Hi Jane,\n\nThank you for letting us know. Because this appears to be an active leak, we are escalating this immediately.\n\nIf water is actively entering the apartment or there is any immediate safety concern, please also call emergency building support right away so this is not delayed by email.\n\nPlease send any photos or videos if available, and confirm your best phone number and whether anyone is currently home.\n\nBest,\nAnthony\nProperty Manager",
  },
  {
    id: "refund",
    from: "Michael Lee",
    subject: "Move-out deposit refund status",
    preview:
      "Hello, I moved out last month and want to know when I will get my move-out deposit back.",
    received: "Jun 9, 9:02 AM",
    building: "88 West 29th Street",
    apartment: "7C",
    senderType: "Former renter",
    priority: "P2 Standard",
    category: "Refund / Deposit",
    status: "Waiting for Client",
    owner: "Property Manager",
    due: "2 business days",
    nextAction:
      "Direct client to refund form and confirm that approval and processing are not automatic.",
    route: "Owner Refund Request form",
    missingInfo: ["T-Code if available", "Mailing address", "Refund amount"],
    reply:
      "Hi Michael,\n\nThank you for reaching out. Refund requests are subject to review and approval by the Board, Manager, and/or Property Manager.\n\nTo help process this properly, please submit the refund request through the owner refund request form and include your building, apartment number, T-Code/account number if available, mailing address, refund amount, and any supporting documents.\n\nPlease note that once properly submitted, refunds may take approximately 6 to 8 weeks to process.\n\nBest,\nAnthony\nProperty Manager",
  },
  {
    id: "dishwasher",
    from: "Sarah Cohen",
    subject: "Dishwasher stopped working",
    preview: "My dishwasher stopped working. Can someone come this week?",
    received: "Jun 9, 10:18 AM",
    building: "45 Park Place",
    apartment: "2A",
    senderType: "Tenant",
    priority: "P2 Standard",
    category: "Repairs / Electrical or Appliances",
    status: "Waiting for Details",
    owner: "Property Manager",
    due: "1 business day",
    nextAction:
      "Collect complete intake details or route to the service request form before scheduling.",
    route: "Service Request form",
    missingInfo: ["Phone number", "Preferred access window", "Appliance details"],
    reply:
      "Hi Sarah,\n\nThank you for reporting this. To create the service request, please confirm your best phone number, preferred access window, and any details about the dishwasher issue.\n\nYou may also submit this directly through the AARS service request form so the request can be routed with the correct information.\n\nBest,\nAnthony\nProperty Manager",
  },
  {
    id: "board-rule",
    from: "David Ortiz",
    subject: "Repeated noise after house-rule hours",
    preview:
      "There has been loud music from the apartment above me after midnight for three nights this week.",
    received: "Jun 9, 11:31 AM",
    building: "210 East 58th Street",
    apartment: "12D",
    senderType: "Shareholder",
    priority: "P1 Same Day",
    category: "Board / Management Complaint",
    status: "Manager Review",
    owner: "Property Manager",
    due: "Today",
    nextAction:
      "Request dates, times, location, and documentation; review house rules before any notice.",
    route: "Manager review, then board-sensitive follow-up if needed",
    missingInfo: ["Specific dates and times", "Apartment source if known", "Prior reports"],
    reply:
      "Hi David,\n\nThank you for bringing this to our attention. Please send the specific dates and approximate times this occurred, whether you know the apartment source, and whether this has been reported before.\n\nWe will review the information against the building's house rules and determine the appropriate next step.\n\nBest,\nAnthony\nProperty Manager",
  },
];

const drafts = Object.fromEntries(scenarios.map((scenario) => [scenario.id, scenario.reply]));
let selectedId = scenarios[0].id;

const inboxList = document.querySelector("#inbox-list");
const trackerBody = document.querySelector("#tracker-body");
const replyDraft = document.querySelector("#reply-draft");
const resetDraft = document.querySelector("#reset-draft");

function selectedScenario() {
  return scenarios.find((scenario) => scenario.id === selectedId) || scenarios[0];
}

function priorityShort(priority) {
  return priority.split(" ")[0];
}

function categoryShort(category) {
  return category.split(" / ")[0];
}

function renderInbox() {
  inboxList.innerHTML = "";

  scenarios.forEach((scenario) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = `inbox-item${scenario.id === selectedId ? " active" : ""}`;
    item.setAttribute("aria-pressed", scenario.id === selectedId ? "true" : "false");

    item.innerHTML = `
      <div class="inbox-title-row">
        <span class="subject"></span>
        <span class="pill${scenario.id === selectedId ? " active" : ""}"></span>
      </div>
      <p class="meta"></p>
      <p class="preview"></p>
    `;

    item.querySelector(".subject").textContent = scenario.subject;
    item.querySelector(".pill").textContent = scenario.priority;
    item.querySelector(".meta").textContent =
      `${scenario.from} · ${scenario.received} · ${scenario.building}, Apt ${scenario.apartment}`;
    item.querySelector(".preview").textContent = scenario.preview;

    item.addEventListener("click", () => {
      selectedId = scenario.id;
      render();
    });

    inboxList.appendChild(item);
  });
}

function renderDecision() {
  const scenario = selectedScenario();

  document.querySelector("#metric-priority").textContent = priorityShort(scenario.priority);
  document.querySelector("#metric-category").textContent = categoryShort(scenario.category);
  document.querySelector("#metric-status").textContent = scenario.status;
  document.querySelector("#metric-due").textContent = scenario.due;
  document.querySelector("#route-pill").textContent = scenario.route;
  document.querySelector("#next-action").textContent = scenario.nextAction;
  document.querySelector("#sender-type").textContent = scenario.senderType;
  document.querySelector("#building").textContent =
    `${scenario.building}, Apt ${scenario.apartment}`;
  document.querySelector("#owner").textContent = scenario.owner;

  const missingInfo = document.querySelector("#missing-info");
  missingInfo.innerHTML = "";
  scenario.missingInfo.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    missingInfo.appendChild(li);
  });

  replyDraft.value = drafts[scenario.id] || scenario.reply;
}

function renderTracker() {
  trackerBody.innerHTML = "";

  scenarios.forEach((scenario) => {
    const row = document.createElement("tr");
    if (scenario.id === selectedId) row.classList.add("selected");

    [
      scenario.received,
      `${scenario.from} · Apt ${scenario.apartment}`,
      scenario.category,
      scenario.priority,
      scenario.status,
      scenario.owner,
      scenario.due,
    ].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    trackerBody.appendChild(row);
  });
}

function render() {
  renderInbox();
  renderDecision();
  renderTracker();
}

replyDraft.addEventListener("input", () => {
  drafts[selectedId] = replyDraft.value;
});

resetDraft.addEventListener("click", () => {
  const scenario = selectedScenario();
  drafts[scenario.id] = scenario.reply;
  replyDraft.value = scenario.reply;
});

render();
