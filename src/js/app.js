import * as flsFunctions from "./modules/functions.js";
import { data } from "./modules/data.js";

flsFunctions.isWebp();

let wrapper = document.getElementById("wrapper");
let burger = document.getElementsByClassName("burger")[0];
let list = document.getElementsByClassName("header__list")[0];
let arrows = document.querySelectorAll(".select-arrow");
let selects = document.querySelectorAll(".select");

burger.onclick = () => {
  wrapper.classList.toggle("blur");
  burger.classList.toggle("burger__active");
  list.classList.toggle("show");
};

selects.forEach((select, index) => {
  select.addEventListener("click", function (event) {
    event.stopPropagation();
    selects.forEach((otherSelect, otherIndex) => {
      if (otherIndex !== index) {
        arrows[otherIndex].classList.remove("clicked");
      }
    });
    arrows[index].classList.add("clicked");
  });
});

document.addEventListener("click", function (event) {
  selects.forEach((select, index) => {
    const isClickedInside = select.contains(event.target);
    if (!isClickedInside) {
      arrows[index].classList.remove("clicked");
    }
  });
});

arrows.forEach((arrow) => {
  arrow.addEventListener("onfocus", () => {
    arrow.classList.toggle("clicked");
  });
});

const projectsContainer = document.querySelector(".project-js");
const filtersForm = document.querySelector(".js-filters");
const activeFilters = {};

const createProjectTemplate = (project) => {
  return `
    <div class="card">
      <div class="card__image">
        <img src="${project.img}" 14.png" alt="" />
      </div>
      <div class="card__title">
        <h4>${project.title}</h4>
      </div>
      <div class="card__text">
        <p>
        ${project.desc}
        </p>
      </div>
      <div class="card__stack">
        <p>Tech stack : ${project.technology
          .map((item) => item.title)
          .join(", ")}</p>
          <p>Tech stack : ${project.platform
            .map((item) => item.title)
            .join(", ")}</p>
            <p>Tech stack : ${project.theme
              .map((item) => item.title)
              .join(",")}</p>
      </div>
      <div class="card__links">
        <a href="" class="link">
          <img src="/img/akar-icons_link-chain.svg" alt="" />
          <p>Live Preview</p>
        </a>
        <a href="" class="link">
          <img src="/img/github.svg" alt="" />
          <p>View Code</p>
        </a>
      </div>
    </div>
    `;
};

const createNanTemplate = () => {
  return `
    <div class="cards-none">
            <p>There are no items that satisfy the filter</p>
          </div>
      `;
};

const dataRender = (data, container) => {
  if (!(typeof data === "object")) {
    return "";
  }
  let content = "";
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      content += createProjectTemplate(data[i]);
    }
  } else {
    content += createNanTemplate();
  }

  container.innerHTML = content;
};

const itemIsValid = (dataItem, activeFilters) => {
  let count = 0;
  for (const activeFilterKey in activeFilters) {
    const activeFilterValue = activeFilters[activeFilterKey];
    const itemHasFilterValue = dataItem[activeFilterKey]
      .map((item) => item.id)
      .includes(activeFilterValue);
    if (itemHasFilterValue) {
      count++;
    }
  }
  return Object.keys(activeFilters).length === count;
};

const handleFormChange = (event) => {
  const target = event.target;

  const targetValue = target.value;
  const targetName = target.name;
  if (targetValue === "") {
    delete activeFilters[targetName];
    if (!Object.keys(activeFilters).length) {
      dataRender(data, projectsContainer);
      return;
    }
  } else {
    activeFilters[targetName] = targetValue;
  }
  const filteredData = data.filter((dataItem) =>
    itemIsValid(dataItem, activeFilters)
  );
  dataRender(filteredData, projectsContainer);
};
filtersForm.addEventListener("change", handleFormChange);
dataRender(data, projectsContainer);
