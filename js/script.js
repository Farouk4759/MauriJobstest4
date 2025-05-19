

/// Load job data from jobs.json
let jobs = [];
const jobList = document.getElementById('jobList');
const searchInput = document.getElementById('searchInput');
const searchForm = document.querySelector('.search-form');

// Render job cards
function renderJobs(jobArray) {
  const jobList = document.getElementById('jobList');
  if (!jobList) return;
  jobList.innerHTML = '';

  const today = new Date();

  jobArray.forEach((job, index) => {
    if (job.deadline) {
      const jobDeadline = new Date(job.deadline);
      if (jobDeadline < today) return; // Skip expired jobs
    }

    const jobCard = document.createElement('div');
    jobCard.className = 'job-card';
    jobCard.innerHTML = `
      <a href="job.html?id=${index}" style="text-decoration:none; color:inherit;">
        <h2 class="job-title">${job.title || ''}</h2>
        <p class="company-name">${job.company || ''}</p>
        <div class="job-meta">
          <span>📍 ${job.location || ''}</span>
          <span>🗓 Deadline: ${job.deadline || ''}</span>
          ${job.extra ? `<span>📝 ${job.extra}</span>` : ''}
        </div>
      </a>
    `;
    jobList.appendChild(jobCard);
  });
}


// Function to handle the search
function handleSearch() {
    if (!searchInput) return;
    const keyword = searchInput.value.toLowerCase().trim();
    const filtered = jobs.filter(job =>
        (job.title && job.title.toLowerCase().includes(keyword)) ||
        (job.company && job.company.toLowerCase().includes(keyword)) ||
        (job.location && job.location.toLowerCase().includes(keyword)) ||
        (job.extra && job.extra.toLowerCase().includes(keyword))
    );
    renderJobs(filtered);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    if (!jobList || !searchInput || !searchForm) return;

    // Load job data and render it initially
    fetch('data/jobs.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            jobs = data;
            renderJobs(jobs); // Render all jobs initially
        })
        .catch(error => console.error('Failed to load jobs:', error));

    // Event listener for form submission (button click or Enter key)
    searchForm.addEventListener('submit', e => {
        e.preventDefault(); // Prevent the default form submission
        handleSearch();
    });

    // Event listener for input changes in the search bar
    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim() === '') {
            // If the search bar is empty, render the full list of jobs
            renderJobs(jobs);
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  toggleButton.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
});
