const stackElement = document.querySelector("#cup-stack");
const detailPanel = document.querySelector(".detail-panel");
const detailTitle = document.querySelector("#detail-title");
const detailDesc = document.querySelector("#detail-desc");
const detailLink = document.querySelector("#detail-link");
const template = document.querySelector("#cup-template");

const fallbackProjects = [
  {
    title: "Brand Archive",
    url: "https://example.com/brand-archive",
    desc: "브랜드 스토리와 제품 라인업을 한 화면에서 탐색할 수 있도록 설계한 아카이브형 웹사이트."
  },
  {
    title: "Creator Dashboard",
    url: "https://example.com/creator-dashboard",
    desc: "콘텐츠 성과, 일정, 협업 요청을 빠르게 파악할 수 있도록 구성한 크리에이터 대시보드."
  },
  {
    title: "City Guide Campaign",
    url: "https://example.com/city-guide",
    desc: "지역 행사와 장소 정보를 시각적으로 큐레이션한 프로모션 랜딩페이지."
  },
  {
    title: "Studio Booking Flow",
    url: "https://example.com/studio-booking",
    desc: "촬영 스튜디오 예약 단계를 단순화하고 전환율을 높이는 데 초점을 둔 예약 플로우."
  },
  {
    title: "Signal Commerce",
    url: "https://example.com/signal-commerce",
    desc: "상품 큐레이션과 빠른 결제 경험을 결합한 실험형 커머스 프로젝트."
  },
  {
    title: "Live Event Microsite",
    url: "https://example.com/live-event",
    desc: "라이브 일정, 하이라이트, 티켓 링크를 집약해 보여주는 이벤트 마이크로사이트."
  }
];

const defaultDetail = {
  title: "Project",
  desc: "Hover over a cup to read the project.",
  url: "#"
};

let currentProjects = [];
let activeIndex = -1;
let pinnedIndex = -1;

const getStackIndexFromDomIndex = (domIndex, total) => total - domIndex - 1;

const getEffectiveIndex = () => (pinnedIndex >= 0 ? pinnedIndex : activeIndex);

const updateDetail = (project, activeCard) => {
  detailTitle.textContent = project.title;
  detailDesc.textContent = project.desc;
  detailLink.href = project.url;
  detailLink.textContent = "Open Project";
  detailLink.classList.toggle("is-disabled", project.url === "#");
  detailLink.setAttribute("aria-disabled", String(project.url === "#"));

  document.querySelectorAll(".cup-card").forEach((card) => {
    card.classList.remove("is-active");
    card.classList.remove("is-pinned");
  });

  if (activeCard) {
    activeCard.classList.add("is-active");
    if (pinnedIndex >= 0) {
      activeCard.classList.add("is-pinned");
    }
    detailPanel.classList.add("is-visible");
  } else {
    detailPanel.classList.remove("is-visible");
  }
};

const computeBottomOffset = (stackIndex, activeStackIndex) => {
  const compactGap = 34;
  const focusLift = 108;
  const aboveGap = 40;

  if (activeStackIndex < 1) {
    return stackIndex * compactGap;
  }

  if (stackIndex < activeStackIndex) {
    return stackIndex * compactGap;
  }

  if (stackIndex === activeStackIndex) {
    return (stackIndex * compactGap) + focusLift;
  }

  return (activeStackIndex * compactGap) + focusLift + ((stackIndex - activeStackIndex) * aboveGap);
};

const applyStackLayout = () => {
  const cards = [...stackElement.querySelectorAll(".cup-card")];
  const total = cards.length;
  const effectiveIndex = getEffectiveIndex();
  const rawActiveStackIndex = effectiveIndex < 0 ? -1 : getStackIndexFromDomIndex(effectiveIndex, total);
  const activeStackIndex = rawActiveStackIndex === 0 ? -1 : rawActiveStackIndex;

  cards.forEach((card, domIndex) => {
    const stackIndex = getStackIndexFromDomIndex(domIndex, total);
    const bottom = computeBottomOffset(stackIndex, activeStackIndex);
    const layer = total - stackIndex;

    card.style.setProperty("--cup-bottom", `${bottom}px`);
    card.style.zIndex = String(layer);
  });
};

const syncSelection = () => {
  const index = getEffectiveIndex();

  if (index < 0) {
    updateDetail(defaultDetail, null);
  } else {
    const cards = stackElement.querySelectorAll(".cup-card");
    updateDetail(currentProjects[index], cards[index]);
  }

  applyStackLayout();
};

const setActiveCup = (index) => {
  if (pinnedIndex >= 0) {
    return;
  }

  activeIndex = index;
  syncSelection();
};

const togglePinnedCup = (index) => {
  pinnedIndex = pinnedIndex === index ? -1 : index;
  activeIndex = pinnedIndex >= 0 ? index : -1;
  syncSelection();
};

const createCupCard = (project, index) => {
  const cup = template.content.firstElementChild.cloneNode(true);
  const label = cup.querySelector(".cup-label");
  const indexBadge = cup.querySelector(".cup-index");
  const shortTitle = project.title.length > 24 ? `${project.title.slice(0, 22)}...` : project.title;

  cup.href = "#";
  cup.setAttribute("aria-label", `View project ${project.title}`);
  label.textContent = shortTitle;
  indexBadge.textContent = String(index + 1).padStart(2, "0");

  cup.addEventListener("mouseenter", () => setActiveCup(index));
  cup.addEventListener("focus", () => setActiveCup(index));
  cup.addEventListener("click", (event) => {
    event.preventDefault();
    togglePinnedCup(index);
  });

  return cup;
};

const renderProjects = (projects) => {
  currentProjects = projects;
  activeIndex = -1;
  pinnedIndex = -1;
  stackElement.innerHTML = "";

  projects.forEach((project, index) => {
    stackElement.appendChild(createCupCard(project, index));
  });

  syncSelection();
};

const renderError = () => {
  renderProjects(fallbackProjects);
};

const loadProjects = async () => {
  try {
    const response = await fetch("./assets/data/projects.json");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const projects = await response.json();
    const validProjects = projects.filter((project) => project.title && project.url && project.desc);

    renderProjects(validProjects.length ? validProjects : fallbackProjects);
  } catch (error) {
    console.error(error);
    renderError();
  }
};

stackElement.addEventListener("mouseleave", () => {
  if (pinnedIndex < 0) {
    setActiveCup(-1);
  }
});

stackElement.addEventListener("focusout", (event) => {
  if (pinnedIndex < 0 && !stackElement.contains(event.relatedTarget)) {
    setActiveCup(-1);
  }
});

syncSelection();
loadProjects();
