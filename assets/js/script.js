const stackElement = document.querySelector("#cup-stack");
const stackCurrent = document.querySelector("#stack-current");
const stackTotal = document.querySelector("#stack-total");
const template = document.querySelector("#cup-template");

const fallbackProjects = [
  {
    title: "emptycupstack",
    desc: "Interactive portfolio page with a stacked cup motif.",
    pages: "https://inis2.github.io/emptycupstack/",
    github: "https://github.com/INIS2/emptycupstack"
  },
  {
    title: "MultiCV",
    desc: "Create and edit multiple CV templates from one source.",
    pages: "https://inis2.github.io/MultiCV/",
    github: "https://github.com/INIS2/MultiCV"
  }
];

let currentProjects = [];
let expandedIndex = -1;
let hoverIndex = -1;
let dragStartY = 0;
let dragStartScrollTop = 0;
let isDraggingStack = false;
let suppressNextClick = false;
let pressIndex = -1;
let scrollTarget = 0;
let scrollFrame = 0;
let isCoffeeTransitioning = false;

const DEFAULT_STACK_GAP = 72;
const CUP_FLOAT_RATIO = 0.2;

const truncate = (text, length) => (
  text.length > length ? `${text.slice(0, length - 2)}...` : text
);

const hasUrl = (value) => typeof value === "string" && value.trim().length > 0;

const wait = (duration) => new Promise((resolve) => {
  window.setTimeout(resolve, duration);
});

const buildCoffeeScene = (project) => {
  const scene = document.createElement("div");
  const stage = document.createElement("div");
  const machine = document.createElement("img");
  const streamMask = document.createElement("div");
  const stream = document.createElement("img");
  const cup = document.createElement("img");
  const holderWrap = document.createElement("div");
  const holder = document.createElement("img");
  const engraving = document.createElement("div");
  const title = document.createElement("strong");
  const desc = document.createElement("span");

  scene.className = "coffee-scene";
  stage.className = "coffee-stage";
  machine.className = "coffee-machine";
  streamMask.className = "coffee-stream-mask";
  stream.className = "coffee-stream";
  cup.className = "coffee-cup";
  holderWrap.className = "coffee-holder-wrap";
  holder.className = "coffee-holder";
  engraving.className = "coffee-engraving";

  machine.src = "./assets/img/shot_machine.png";
  machine.alt = "";
  machine.setAttribute("aria-hidden", "true");
  stream.src = "./assets/img/coffee.png";
  stream.alt = "";
  stream.setAttribute("aria-hidden", "true");
  cup.src = "./assets/img/cup.png";
  cup.alt = "";
  cup.setAttribute("aria-hidden", "true");
  holder.src = "./assets/img/holder.png";
  holder.alt = "";
  holder.setAttribute("aria-hidden", "true");

  title.textContent = project.title;
  desc.textContent = truncate(project.desc, 80);
  engraving.append(title, desc);
  holderWrap.append(holder, engraving);
  streamMask.append(stream);
  stage.append(machine, streamMask, cup, holderWrap);
  scene.append(stage);

  return scene;
};

const runCoffeeTransition = async (project, url) => {
  if (isCoffeeTransitioning || !hasUrl(url)) {
    return;
  }

  isCoffeeTransitioning = true;
  const scene = buildCoffeeScene(project);
  document.body.appendChild(scene);
  document.body.classList.add("is-coffee-transitioning");

  await wait(40);
  scene.classList.add("is-ready");
  await wait(1100);
  scene.classList.add("is-seated");
  await wait(1120);
  scene.classList.add("is-machine-ready");
  await wait(1350);
  scene.classList.add("is-pouring");
  await wait(3200);
  scene.classList.add("is-finished");
  await wait(1250);
  window.location.href = url;
};

const updateStackCount = () => {
  const activeIndex = expandedIndex >= 0 ? expandedIndex : hoverIndex;

  stackCurrent.textContent = activeIndex >= 0
    ? String(activeIndex + 1).padStart(2, "0")
    : "--";
  stackTotal.textContent = String(currentProjects.length).padStart(2, "0");
};

const getMaxStackScroll = () => Math.max(0, stackElement.scrollHeight - stackElement.clientHeight);

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const animateStackScroll = () => {
  const distance = scrollTarget - stackElement.scrollTop;

  if (Math.abs(distance) < 0.5) {
    stackElement.scrollTop = scrollTarget;
    scrollFrame = 0;
    return;
  }

  stackElement.scrollTop += distance * 0.22;
  scrollFrame = window.requestAnimationFrame(animateStackScroll);
};

const scrollStackBy = (delta) => {
  scrollTarget = clamp(scrollTarget + delta, 0, getMaxStackScroll());

  if (!scrollFrame) {
    scrollFrame = window.requestAnimationFrame(animateStackScroll);
  }
};

const jumpStackToBottom = () => {
  scrollTarget = getMaxStackScroll();
  stackElement.scrollTop = scrollTarget;
};

const getCardIndexFromEvent = (event) => {
  const card = event.target.closest(".cup-card");
  return card ? Number(card.dataset.index) : -1;
};

const getStackGap = (card) => (
  Number.parseFloat(window.getComputedStyle(card).getPropertyValue("--stack-gap")) || DEFAULT_STACK_GAP
);

const getCupFloatGap = (height) => height * CUP_FLOAT_RATIO;

const keepExpandedCupInside = () => {
  if (expandedIndex < 0) {
    return;
  }

  const cards = stackElement.querySelectorAll(".cup-card");
  const card = cards[expandedIndex];
  if (!card) {
    return;
  }

  const padding = 12;
  const lift = Number.parseFloat(card.style.getPropertyValue("--cup-lift")) || 0;
  const hasBelowCup = expandedIndex < cards.length - 1;
  const floatGap = hasBelowCup ? getCupFloatGap(card.offsetHeight) : 0;
  const top = card.offsetTop + lift;
  const bottom = top + card.offsetHeight + floatGap;
  const viewTop = stackElement.scrollTop;
  const viewBottom = viewTop + stackElement.clientHeight;

  if (top < viewTop + padding) {
    scrollTarget = Math.max(0, top - padding);
    stackElement.scrollTop = scrollTarget;
  } else if (bottom > viewBottom - padding) {
    scrollTarget = bottom - stackElement.clientHeight + padding;
    stackElement.scrollTop = scrollTarget;
  }
};

const applyStackLayout = () => {
  const cards = [...stackElement.querySelectorAll(".cup-card")];
  const cardHeight = cards[0]?.getBoundingClientRect().height ?? 0;
  const stackGap = cards[0] ? getStackGap(cards[0]) : DEFAULT_STACK_GAP;
  const cupFloatGap = getCupFloatGap(cardHeight);
  const lastIndex = cards.length - 1;
  const liftIndex = expandedIndex >= 0 ? expandedIndex : hoverIndex;
  const canLift = liftIndex >= 0 && liftIndex < lastIndex;
  const topReserve = canLift ? cupFloatGap : 0;
  const expandedGap = expandedIndex >= 0 && expandedIndex < lastIndex
    ? Math.max(0, cardHeight - stackGap)
    : 0;
  const stackHeight = Math.max(0, topReserve + ((cards.length - 1) * stackGap) + cardHeight + expandedGap);
  const baseTop = Math.max(0, stackElement.clientHeight - stackHeight);

  stackElement.style.setProperty("--stack-height", `${stackHeight}px`);

  cards.forEach((card, index) => {
    const isExpanded = index === expandedIndex;
    const isLifted = canLift && index <= liftIndex;
    const top = baseTop + topReserve + (index * stackGap) + (expandedIndex >= 0 && index > expandedIndex ? expandedGap : 0);
    const toggle = card.querySelector(".cup-toggle");
    const summary = card.querySelector(".cup-summary");

    card.classList.toggle("is-expanded", isExpanded);
    card.classList.toggle("is-lifted", isLifted);
    card.style.setProperty("--cup-top", `${top}px`);
    card.style.setProperty("--cup-lift", isLifted ? `-${cupFloatGap}px` : "0px");
    card.style.zIndex = String(index + 1);
    toggle.setAttribute("aria-expanded", String(isExpanded));
    summary.setAttribute("aria-expanded", String(isExpanded));
  });
};

const syncState = () => {
  updateStackCount();
  applyStackLayout();
  keepExpandedCupInside();
};

const toggleProject = (index, options = {}) => {
  if (suppressNextClick && !options.force) {
    return;
  }

  expandedIndex = expandedIndex === index ? -1 : index;
  hoverIndex = -1;
  syncState();
};

const setHoverProject = (index) => {
  if (expandedIndex >= 0 || isDraggingStack) {
    return;
  }

  hoverIndex = index;
  syncState();
};

const clearHoverProject = () => {
  if (expandedIndex >= 0 || isDraggingStack) {
    return;
  }

  hoverIndex = -1;
  syncState();
};

const createCupCard = (project, index) => {
  const card = template.content.firstElementChild.cloneNode(true);
  const toggle = card.querySelector(".cup-toggle");
  const summary = card.querySelector(".cup-summary");

  const title = document.createElement("strong");
  const desc = document.createElement("span");

  card.dataset.index = String(index);
  title.textContent = project.title;
  desc.textContent = truncate(project.desc, 86);
  summary.replaceChildren(title, desc);

  if (hasUrl(project.pages)) {
    card.querySelector('[data-link="page-coffee"]').href = project.pages;
    card.querySelector('[data-link="page-current"]').href = project.pages;
    card.querySelector('[data-link="page-new"]').href = project.pages;
  } else {
    card.querySelector('[data-link="page-coffee"]').closest(".cup-action-group").remove();
  }

  if (hasUrl(project.github)) {
    card.querySelector('[data-link="github-coffee"]').href = project.github;
    card.querySelector('[data-link="github-current"]').href = project.github;
    card.querySelector('[data-link="github-new"]').href = project.github;
  } else {
    card.querySelector('[data-link="github-coffee"]').closest(".cup-action-group").remove();
  }

  if (!card.querySelector(".cup-action-group")) {
    card.querySelector(".cup-actions").remove();
  }
  toggle.setAttribute("aria-label", `Expand project ${project.title}`);
  summary.setAttribute("aria-label", `Expand project ${project.title}`);
  toggle.addEventListener("focus", () => setHoverProject(index));
  summary.addEventListener("focus", () => setHoverProject(index));

  [toggle, summary].forEach((target) => {
    target.addEventListener("mouseenter", () => setHoverProject(index));
    target.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleProject(index);
    });
  });

  card.querySelectorAll(".cup-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.stopPropagation();

      if (link.classList.contains("cup-link-coffee")) {
        event.preventDefault();
        runCoffeeTransition(project, link.href);
      }
    });
  });

  return card;
};

const renderProjects = (projects) => {
  currentProjects = projects;
  expandedIndex = -1;
  hoverIndex = -1;
  stackElement.innerHTML = "";

  projects.forEach((project, index) => {
    stackElement.appendChild(createCupCard(project, index));
  });

  syncState();
  jumpStackToBottom();
};

const loadProjects = async () => {
  try {
    const response = await fetch("./assets/data/projects.json");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const projects = await response.json();
    const validProjects = projects.filter((project) => (
      project.title && project.desc && (hasUrl(project.pages) || hasUrl(project.github))
    ));

    renderProjects(validProjects.length ? validProjects : fallbackProjects);
  } catch (error) {
    console.error(error);
    renderProjects(fallbackProjects);
  }
};

const resizeObserver = new ResizeObserver(() => {
  applyStackLayout();
  keepExpandedCupInside();
});

stackElement.addEventListener("mouseleave", clearHoverProject);
stackElement.addEventListener("focusout", (event) => {
  if (!stackElement.contains(event.relatedTarget)) {
    clearHoverProject();
  }
});

stackElement.addEventListener("wheel", (event) => {
  if (stackElement.scrollHeight <= stackElement.clientHeight) {
    return;
  }

  event.preventDefault();
  scrollStackBy(event.deltaY);
}, { passive: false });

stackElement.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 || event.target.closest(".cup-link")) {
    return;
  }

  pressIndex = getCardIndexFromEvent(event);

  if (stackElement.scrollHeight <= stackElement.clientHeight) {
    return;
  }

  stackElement.setPointerCapture(event.pointerId);
  stackElement.classList.add("is-dragging");
  dragStartY = event.clientY;
  dragStartScrollTop = stackElement.scrollTop;
  scrollTarget = stackElement.scrollTop;
  isDraggingStack = false;
});

stackElement.addEventListener("pointermove", (event) => {
  if (!stackElement.hasPointerCapture(event.pointerId)) {
    return;
  }

  const deltaY = event.clientY - dragStartY;
  if (Math.abs(deltaY) > 4) {
    isDraggingStack = true;
    suppressNextClick = true;
    hoverIndex = -1;
  }

  if (isDraggingStack) {
    event.preventDefault();
    stackElement.scrollTop = dragStartScrollTop - deltaY;
    scrollTarget = stackElement.scrollTop;
    applyStackLayout();
  }
});

const endStackDrag = (event) => {
  if (!stackElement.hasPointerCapture(event.pointerId)) {
    return;
  }

  const wasDraggingStack = isDraggingStack;
  const pressedProjectIndex = pressIndex;

  stackElement.releasePointerCapture(event.pointerId);
  stackElement.classList.remove("is-dragging");
  isDraggingStack = false;
  pressIndex = -1;

  if (!wasDraggingStack && pressedProjectIndex >= 0) {
    suppressNextClick = true;
    toggleProject(pressedProjectIndex, { force: true });
  }

  window.setTimeout(() => {
    suppressNextClick = false;
  }, 80);
};

stackElement.addEventListener("pointerup", endStackDrag);
stackElement.addEventListener("pointercancel", endStackDrag);

resizeObserver.observe(stackElement);
updateStackCount();
loadProjects();
