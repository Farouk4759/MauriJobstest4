// Get job ID from URL
const params = new URLSearchParams(window.location.search);
const jobId = parseInt(params.get("id"));

// Load jobs and display the selected one
fetch('data/jobs.json')
  .then(res => res.json())
  .then(data => {
    const job = data[jobId];
    if (job) {
      displayJobDetails(job);
    } else {
      document.getElementById('jobDetails').innerHTML = '<p>Job not found.</p>';
    }
  })
  .catch(err => {
    console.error('Error loading job:', err);
  });

function displayJobDetails(job) {
  const container = document.getElementById('jobDetails');

  const renderList = (items) => {
    if (!items || !items.length) return "<p>Not provided.</p>";
    return `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
  };

  container.innerHTML = `
    <div class="job-details-header">
      <h2>${job.title}</h2>
      <div class="company">${job.organization || job.company} - ${job.location}</div>
    </div>

    <div class="details-grid">
      <!-- LEFT: Main Content -->
      <div class="description-box">
        <h3>Description</h3>
        <p>${job.description || "No description provided."}</p>

        ${job.summary ? `
          <h3>Résumé</h3>
          <p>${job.summary}</p>
        ` : ''}

        ${job.responsibilities ? `
          <h3>Tâches et Responsabilités</h3>
          ${renderList(job.responsibilities)}
        ` : ''}

        ${job.qualifications ? `
          <h3>Qualifications et Expérience Requises</h3>
          ${renderList(job.qualifications)}
        ` : ''}

        ${job.note ? `
          <h4>Note</h4>
          <p>${job.note}</p>
        ` : ''}
      </div>

      <!-- RIGHT: Sidebar -->
      <div class="sidebar-box">
        <p><strong>Organisation:</strong> ${job.organization || job.company}</p>
        <p><strong>Location:</strong> ${job.location}</p>
        <p><strong>Deadline:</strong> ${job.application?.deadline || job.deadline || "N/A"}</p>

        ${job.application?.email ? `
          <p><strong>Email:</strong> <a href="mailto:${job.application.email}">${job.application.email}</a></p>
        ` : ''}

        ${job.application?.subject ? `
          <p><strong>Email Subject:</strong> ${job.application.subject}</p>
        ` : ''}

        ${job.extra ? `<p><strong>Extra:</strong> ${job.extra}</p>` : ''}

        <div class="button-group">
          <a class="btn" id="applyNowBtn" href="#">Apply Now</a>
          ${job.companyWebsite ? `
            <a class="btn secondary" href="${job.companyWebsite}" target="_blank">Visit Website</a>
          ` : ''}
          ${job.pdf ? `
            <a class="btn outline" href="${job.pdf}" download>Download PDF</a>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  // ✅ Add functionality to "Apply Now" button
  const applyBtn = document.getElementById('applyNowBtn');
  if (applyBtn) {
    applyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (job.application?.email) {
        const subject = job.application.subject || 'Application';
        window.location.href = `mailto:${job.application.email}?subject=${encodeURIComponent(subject)}`;
      } else {
        alert('No application email provided.');
      }
    });
  }
}



