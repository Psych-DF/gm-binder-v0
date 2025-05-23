const imageCount = 20; // Adjust to match your actual assets
const grid = document.getElementById('grid');

async function loadCards() {
  for (let i = 1; i <= imageCount; i++) {
    let jsonData = null;

    try {
      const res = await fetch(`output/${i}.json`);
      if (!res.ok) throw new Error(`Missing JSON for ${i}`);
      jsonData = await res.json();
    } catch (err) {
      console.warn(`Could not load JSON for card ${i}:`, err.message);
    }

    // Build back side
    let backHTML = `<div class="card-back"><h4>${jsonData?.name || `Card ${i}`}</h4>`;
    if (jsonData?.attributes) {
      backHTML += jsonData.attributes.map(attr =>
        `<div class="attr"><strong>${attr.trait_type.toUpperCase()}</strong>: ${attr.value}</div>`
      ).join('');
    } else {
      backHTML += `<em>No metadata found.</em>`;
    }
    backHTML += `</div>`;

    // Card element
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <img src="output/${i}.png" alt="Card ${i}">
        </div>
        ${backHTML}
      </div>
    `;
    grid.appendChild(card);
  }

  // Flip logic: only one at a time
  document.addEventListener('click', function (event) {
    const clickedCard = event.target.closest('.card');
    document.querySelectorAll('.card').forEach(card => {
      if (card !== clickedCard) card.classList.remove('flipped');
    });
    if (clickedCard) clickedCard.classList.toggle('flipped');
  });
}

loadCards();
