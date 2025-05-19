// Load tender data from tenders.json
let tenders = [];
const tenderList = document.getElementById('tenderList') || document.getElementById('jobList');
const searchInput = document.getElementById('searchInput');
const searchForm = document.querySelector('.search-form');

// Render tender cards
function renderTenders(tenderArray) {
  if (!tenderList) return;
  tenderList.innerHTML = '';

  const today = new Date();

  tenderArray.forEach((tender, index) => {
    if (tender.deadline) {
      const tenderDeadline = new Date(tender.deadline);
      if (tenderDeadline < today) return; // Skip expired tenders
    }

    const tenderCard = document.createElement('div');
    tenderCard.className = 'job-card'; // Reuse job-card styling
    tenderCard.innerHTML = `
      <a href="tender-details.html?id=${index}" style="text-decoration:none; color:inherit;">
        <h2 class="job-title">${tender.title || ''}</h2>
        <p class="company-name">${tender.organization || ''}</p>
        <div class="job-meta">
          <span>📍 ${tender.location || ''}</span>
          <span>🗓 Deadline: ${tender.deadline || ''}</span>
          ${tender.extra ? `<span>📝 ${tender.extra}</span>` : ''}
        </div>
      </a>
    `;
    tenderList.appendChild(tenderCard);
  });
}

// Function to handle the search
function handleTenderSearch() {
  if (!searchInput) return;
  const keyword = searchInput.value.toLowerCase().trim();
  const filtered = tenders.filter(tender =>
    (tender.title && tender.title.toLowerCase().includes(keyword)) ||
    (tender.organization && tender.organization.toLowerCase().includes(keyword)) ||
    (tender.location && tender.location.toLowerCase().includes(keyword)) ||
    (tender.extra && tender.extra.toLowerCase().includes(keyword))
  );
  renderTenders(filtered);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  if (!tenderList || !searchInput || !searchForm) return;

  // Load tender data and render it initially
  fetch('data/tenders.json')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      tenders = data;
      renderTenders(tenders); // Render all tenders initially
    })
    .catch(error => console.error('Failed to load tenders:', error));

  // On form submit
  searchForm.addEventListener('submit', e => {
    e.preventDefault(); // Prevent the default form submission
    handleTenderSearch();
  });

  // Reset to full list if input is cleared
  searchInput.addEventListener('input', () => {
    if (searchInput.value.trim() === '') {
      renderTenders(tenders);
    }
  });
});

