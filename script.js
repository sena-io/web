const items = [
  { year: 1857, title: "플로베르 『보바리 부인』", era: "사실주의", description: "일상의 사실적 묘사" },
  { year: 1866, title: "도스토옙스키 『죄와 벌』", era: "사실주의", description: "인간 내면·심리의 탐구" },
  { year: 1869, title: "톨스토이 『전쟁과 평화』", era: "사실주의", description: "대하 역사소설" },
  { year: 1873, title: "랭보 『지옥에서 보낸 한 철』", era: "상징주의", description: "상징주의를 연 산문시" },
  { year: 1880, title: "졸라 『나나』", era: "자연주의", description: "환경·유전의 결정론" },
  { year: 1913, title: "프루스트 『잃어버린 시간을 찾아서』", era: "모더니즘", description: "기억과 의식의 탐구" },
  { year: 1922, title: "조이스 『율리시스』", era: "모더니즘", description: "의식의 흐름 기법" },
  { year: 1925, title: "카프카 『심판』", era: "모더니즘", description: "부조리·불안의 서사" },
  { year: 1927, title: "울프 『등대로』", era: "모더니즘", description: "의식의 흐름·시간의 재현" }
];

const eraColors = {
  "사실주의": "var(--realism)",
  "상징주의": "var(--symbolism)",
  "자연주의": "var(--naturalism)",
  "모더니즘": "var(--modernism)"
};

const timeline = document.querySelector("#timeline");
const legend = document.querySelector("#legend");
const detailPanel = document.querySelector("#detailPanel");
const template = document.querySelector("#timelineItemTemplate");
const resetButton = document.querySelector("#resetButton");

let activeEra = null;
let activeIndex = null;

function renderTimeline() {
  timeline.innerHTML = "";

  items
    .slice()
    .sort((a, b) => a.year - b.year)
    .forEach((item, index) => {
      const fragment = template.content.cloneNode(true);
      const button = fragment.querySelector(".timeline-item");

      button.style.setProperty("--era-color", eraColors[item.era]);
      button.dataset.era = item.era;
      button.dataset.index = index;
      button.setAttribute("aria-label", `${item.year}년 ${item.title}, ${item.era}`);
      button.querySelector(".item-year").textContent = item.year;
      button.querySelector(".item-era").textContent = item.era;
      button.querySelector(".item-title").textContent = item.title;

      button.addEventListener("click", () => selectItem(index, button));
      timeline.appendChild(fragment);
    });
}

function renderLegend() {
  legend.innerHTML = "";

  Object.entries(eraColors).forEach(([era, color]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "legend-button";
    button.style.setProperty("--era-color", color);
    button.innerHTML = `<span class="legend-swatch"></span>${era}`;
    button.addEventListener("click", () => filterEra(era));
    legend.appendChild(button);
  });
}

function selectItem(index, button) {
  activeIndex = index;

  document.querySelectorAll(".timeline-item").forEach((item) => {
    item.classList.toggle("is-active", item === button);
  });

  const item = items[index];
  detailPanel.style.setProperty("--era-color", eraColors[item.era]);
  detailPanel.innerHTML = `
    <div class="detail-content">
      <div class="detail-year">${item.year}</div>
      <div>
        <span class="detail-era">${item.era}</span>
        <strong class="detail-title">${item.title}</strong>
        <p class="detail-description">${item.description}</p>
      </div>
    </div>
  `;

  detailPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function filterEra(era) {
  activeEra = activeEra === era ? null : era;

  document.querySelectorAll(".timeline-item").forEach((item) => {
    item.classList.toggle("is-hidden", activeEra && item.dataset.era !== activeEra);
  });

  document.querySelectorAll(".legend-button").forEach((button) => {
    const isCurrent = button.textContent.trim() === activeEra;
    button.classList.toggle("is-muted", Boolean(activeEra) && !isCurrent);
  });
}

function resetAll() {
  activeEra = null;
  activeIndex = null;

  document.querySelectorAll(".timeline-item").forEach((item) => {
    item.classList.remove("is-hidden", "is-active");
  });

  document.querySelectorAll(".legend-button").forEach((button) => {
    button.classList.remove("is-muted");
  });

  detailPanel.removeAttribute("style");
  detailPanel.innerHTML = `
    <div class="detail-empty">
      <span class="detail-empty-icon">↗</span>
      <div>
        <strong>연표의 항목을 선택해 보세요.</strong>
        <p>연도, 시대, 작품 설명이 이곳에 표시됩니다.</p>
      </div>
    </div>
  `;
}

resetButton.addEventListener("click", resetAll);

renderLegend();
renderTimeline();
