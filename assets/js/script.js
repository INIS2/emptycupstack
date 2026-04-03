const stackElement = document.querySelector("#cup-stack");
const countElement = document.querySelector("#project-count");
const detailTitle = document.querySelector("#detail-title");
const detailDesc = document.querySelector("#detail-desc");
const detailLink = document.querySelector("#detail-link");
const template = document.querySelector("#cup-template");

const defaultDetail = {
  title: "프로젝트를 선택하세요",
  desc: "컵은 프로젝트 하나를 뜻합니다. 쌓인 컵 중 하나에 커서를 올리면 제목, 설명, URL이 여기에 표시됩니다.",
  url: "#"
};

const updateDetail = (project, activeCard) => {
  detailTitle.textContent = project.title;
  detailDesc.textContent = project.desc;
  detailLink.href = project.url;
  detailLink.textContent = "프로젝트 열기";
  detailLink.classList.toggle("is-disabled", project.url === "#");
  detailLink.setAttribute("aria-disabled", String(project.url === "#"));

  document.querySelectorAll(".cup-card.is-active").forEach((card) => {
    card.classList.remove("is-active");
  });

  if (activeCard) {
    activeCard.classList.add("is-active");
  }
};

const createCupCard = (project, index, total) => {
  const cup = template.content.firstElementChild.cloneNode(true);
  const label = cup.querySelector(".cup-label");
  const indexBadge = cup.querySelector(".cup-index");
  const horizontalShift = `${((index % 2 === 0 ? -1 : 1) * Math.min(index, 6)) * 8}px`;
  const tilt = `${(index % 2 === 0 ? -1 : 1) * Math.min(8, index * 1.2)}deg`;
  const shortTitle = project.title.length > 24 ? `${project.title.slice(0, 22)}...` : project.title;

  cup.href = project.url;
  cup.setAttribute("aria-label", `${project.title} 프로젝트 보기`);
  cup.style.setProperty("--cup-order", total - index - 1);
  cup.style.setProperty("--cup-shift", horizontalShift);
  cup.style.setProperty("--cup-tilt", tilt);
  label.textContent = shortTitle;
  indexBadge.textContent = String(index + 1).padStart(2, "0");

  const activate = () => updateDetail(project, cup);
  const reset = () => updateDetail(defaultDetail, null);

  cup.addEventListener("mouseenter", activate);
  cup.addEventListener("focus", activate);
  cup.addEventListener("mouseleave", reset);
  cup.addEventListener("blur", reset);

  return cup;
};

const renderProjects = (projects) => {
  stackElement.innerHTML = "";
  countElement.textContent = `${projects.length} cups loaded`;

  projects.forEach((project, index) => {
    stackElement.appendChild(createCupCard(project, index, projects.length));
  });
};

const renderError = () => {
  countElement.textContent = "0 cups loaded";
  updateDetail(
    {
      title: "데이터를 불러오지 못했습니다",
      desc: "assets/data/projects.json 파일 형식이 올바른지 확인하세요. 항목은 title, url, desc가 필요합니다.",
      url: "#"
    },
    null
  );
};

const loadProjects = async () => {
  try {
    const response = await fetch("./assets/data/projects.json");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const projects = await response.json();
    const validProjects = projects.filter((project) => project.title && project.url && project.desc);

    renderProjects(validProjects);
  } catch (error) {
    console.error(error);
    renderError();
  }
};

updateDetail(defaultDetail, null);
loadProjects();
