let language = 0;

function loadLanguage() {
  const languageStr = localStorage.getItem("language");
  language = !isNaN(languageStr) ? parseInt(languageStr) : 0;
}

function setLanguage(lang) {
  localStorage.setItem("language", lang);
  language = lang;
  renderProjects(window._cachedData, language);
  updateStaticTexts(language, window._cachedElements);
  highlightActiveLanguage();
}

function updateStaticTexts(language, elements) {
  const textElements = document.querySelectorAll("[data-textkey]");
  
  textElements.forEach(el => {
    const key = el.getAttribute("data-textkey");
    const entry = elements.find(item => item[key]);
    if (entry && entry[key]) {
      el.textContent = entry[key][language] || entry[key][0];
    }
  });
}

function highlightActiveLanguage() {
  const langKey = language === 0 ? "th" : "en";

  document.querySelectorAll(".dropdown-item").forEach(item => {
    item.classList.remove("active");
    const icon = item.querySelector(".check-icon");
    if (icon) icon.textContent = '';
  });

  const activeItem = document.querySelector(`.dropdown-item[data-textkey="${langKey}"]`);
  if (activeItem) {
    activeItem.classList.add("active");
    const icon = activeItem.querySelector(".check-icon");
    if (icon) icon.textContent = '✅';
  }
}



function renderProjects(data, language) {
  const container = document.getElementById("project-container");
  container.innerHTML = "";

  document.querySelectorAll(".modal").forEach(modal => modal.remove());

  data.project.forEach(project => {
    const projectid = project.id[language] || project.id[0];
    const projectname = project.name[language] || project.name[0];
    const projects_description = project.s_description[language] || project.s_description[0];
    const projectdescription = project.description[language] || project.description[0];

    const card = document.createElement("div");
    card.className = "col-12 col-md-4 mb-4";
    card.innerHTML = `
      <div class="card" data-bs-toggle="modal" data-bs-target="#modal-${projectid}" style="cursor: pointer;">
          <img src="img/${projectid}.png" class="card-img-top" alt="${projectname}">
          <div class="card-body" style="padding: 0.5rem 1rem 0.5rem 1rem;">
              <h5 class="card-title">${projectname}</h5>
              <p class="card-text">${projects_description}</p>
          </div>
      </div>
    `;
    container.appendChild(card);

    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = `modal-${projectid}`;
    modal.tabIndex = -1;
    modal.setAttribute("aria-labelledby", `modal-${projectid}-label`);
    modal.setAttribute("aria-hidden", "true");

    let subtopicsHTML = "";
    if (project.subtopic && project.subtopiccontent) {
      for (let i = 0; i < project.subtopic.length; i++) {
        const topicKey = Object.keys(project.subtopic[i])[0];
        const topicTitle = project.subtopic[i][topicKey][language] || project.subtopic[i][topicKey][0];
        const topicContent = project.subtopiccontent[i][topicKey][language] || project.subtopiccontent[i][topicKey][0];
        subtopicsHTML += `<span class="fw-bold">${topicTitle}:</span> ${topicContent}<br>`;
      }
    }
    

    modal.innerHTML = `
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header d-flex justify-content-between align-items-center">
            <h5 class="modal-title w-100 text-center" id="modal-${projectid}-label" data-textkey="de">....</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="ปิด"></button>
          </div>
          <div class="modal-body">
            <img src="img/${projectid}.png" style="max-height: 300px; object-fit: cover; width: 100%; cursor: pointer;" class="img-fluid mb-3" alt="${projectname}">
            <p><span class="fw-bold fs-5">${projectname}</span></p>
            <p style="text-indent: 2em; text-align: justify;">${projectdescription}</p>
            <p style="text-align: justify;">${subtopicsHTML}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" data-textkey="cl">....</button>
            <a href="#" class="btn btn-primary" data-textkey="lo">....</a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  });
}


document.addEventListener("DOMContentLoaded", function () {
  loadLanguage();

  fetch('data/data.json')
    .then(response => response.json())
    .then(data => {
      window._cachedData = data;
      window._cachedElements = data.element;

      renderProjects(data, language);
      updateStaticTexts(language, data.element);
      highlightActiveLanguage();

      setTimeout(() => {
        document.getElementById("loading-screen").remove();
        document.getElementById("main-content").style.display = "block";
      }, 100);
    })
    .catch(error => {
      console.error(error);
      document.getElementById("loading-screen").remove();
      Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่ภายหลัง',
        icon: 'error',
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
    });
});
