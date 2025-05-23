const imageCount = 20; // Update to match your actual total
const grid = document.getElementById('grid');

async function loadCards() {
  for (let i = 1; i <= imageCount; i++) {
    const imageSrc = `output/${i}.png`;
    const jsonSrc = `output/${i}.json`;

    try {
      const res = await fetch(jsonSrc);
      if (!res.ok) throw new Error(`Missing JSON for ${i}`);
      const jsonData = await res.json();

      // Build card back with metadata
      let backHTML = `<div class="card-back"><h4>${jsonData.name || `Card ${i}`}</h4>`;
      if (jsonData.attributes && Array.isArray(jsonData.attributes)) {
        backHTML += jsonData.attributes.map(attr =>
          `<div class="attr"><strong>${attr.trait_type.toUpperCase()}</strong>: ${attr.value}</div>`
        ).join('');
      } else {
        backHTML += `<em>No attributes found.</em>`;
      }
      backHTML += `</div>`;

      // Create card DOM element
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">
            <img src="${imageSrc}" alt="Card ${i}">
          </div>
          ${backHTML}
        </div>
      `;

      grid.appendChild(card);
    } catch (err) {
      console.warn(`Card ${i} skipped due to error:`, err.message);
    }
  }

  // Flip logic: only one card flips at a time
  document.addEventListener('click', function (event) {
    const clickedCard = event.target.closest('.card');
    document.querySelectorAll('.card').forEach(card => {
      if (card !== clickedCard) card.classList.remove('flipped');
    });
    if (clickedCard) clickedCard.classList.toggle('flipped');
  });
}

loadCards();
