document.addEventListener('DOMContentLoaded', () => {
  const tenderDetailsDiv = document.getElementById('tenderDetails');

  // Get the tender id from the URL ?id=0
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);

  if (isNaN(id)) {
    tenderDetailsDiv.innerHTML = '<p style="color:red;">Invalid Tender ID.</p>';
    return;
  }

  fetch('data/tenders.json')
    .then(response => {
      if (!response.ok) throw new Error('Network error');
      return response.json();
    })
    .then(tenders => {
      if (id < 0 || id >= tenders.length) {
        tenderDetailsDiv.innerHTML = '<p style="color:red;">Tender not found.</p>';
        return;
      }

      const tender = tenders[id];

      // Render HTML
      tenderDetailsDiv.innerHTML = `
        <div class="job-details-header">
          <h2>${tender.title || 'No Title'}</h2>
          <div class="company">${tender.organization || 'N/A'} - ${tender.location || 'N/A'}</div>
        </div>

        <div class="details-grid">
          <div class="description-box">
            <h3>Description</h3>
            <p>${tender.description || 'No description available.'}</p>

            ${tender.requirements?.length ? `
              <h3>Requirements</h3>
              <ul>${tender.requirements.map(r => `<li>${r}</li>`).join('')}</ul>
            ` : ''}

            <h4>Contact Email</h4>
            <p><a href="mailto:${tender.contactEmail || '#'}">${tender.contactEmail || 'N/A'}</a></p>
          </div>

          <div class="sidebar-box">
            <p><strong>Organization:</strong> ${tender.organization || 'N/A'}</p>
            <p><strong>Location:</strong> ${tender.location || 'N/A'}</p>
            <p><strong>Deadline:</strong> ${tender.deadline || 'N/A'}</p>

            <div class="button-group">
              ${tender.companyWebsite ? `
                <a class="btn secondary" href="${tender.companyWebsite}" target="_blank">Visit Website</a>
              ` : ''}
              ${tender.pdf ? `
                <a class="btn outline" href="${tender.pdf}" download>Download PDF</a>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    })
    .catch(error => {
      console.error('Error loading tenders:', error);
      tenderDetailsDiv.innerHTML = `<p style="color:red;">Failed to load tender details.</p>`;
    });
});
