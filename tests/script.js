document.addEventListener('DOMContentLoaded', () => {
            // --- SETUP ---
            const scene = document.querySelector('.scene-container');
            const svg = document.querySelector('#connector-svg');
            const addCardBtn = document.querySelector('#addCardBtn');

            // --- DATA STORAGE ---
            // This is where we'll keep track of our cards and connections.
            // Later, you can send this 'connections' array to MongoDB.
            let connections = [];
            let cardCounter = 0;
            let selectedCard = null; // To track the first card clicked for a connection

            // --- CORE FUNCTIONS ---

            /**
             * The main drawing function. It loops through our 'connections' array
             * and draws (or updates) a curvy SVG path for each one.
             */
            function updateAllConnections() {
                connections.forEach(conn => {
                    const cardA = document.getElementById(conn.from);
                    const cardB = document.getElementById(conn.to);
                    const path = document.getElementById(conn.pathId);

                    if (!cardA || !cardB || !path) return;

                    const posA = getCardCenter(cardA);
                    const posB = getCardCenter(cardB);

                    // This is the magic for the curve!
                    // We find a "control point" that is perpendicular to the center of the line.
                    const dx = posB.x - posA.x;
                    const dy = posB.y - posA.y;
                    const curveFactor = 0.3; // Adjust this value to change the curve's bendiness

                    const controlPoint = {
                        x: (posA.x + posB.x) / 2 - dy * curveFactor,
                        y: (posA.y + posB.y) / 2 + dx * curveFactor,
                    };

                    // The SVG path data string for a quadratic Bézier curve
                    const pathData = `M ${posA.x} ${posA.y} Q ${controlPoint.x} ${controlPoint.y} ${posB.x} ${posB.y}`;
                    
                    path.setAttribute('d', pathData);
                });
            }
            
            /**
             * A helper function to get the center coordinates of a card relative to the scene.
             */
            function getCardCenter(cardElement) {
                const rect = cardElement.getBoundingClientRect();
                const containerRect = scene.getBoundingClientRect();
                return {
                    x: rect.left + rect.width / 2 - containerRect.left,
                    y: rect.top + rect.height / 2 - containerRect.top,
                };
            }

            /**
             * Creates a new card, makes it draggable, and adds a click listener for connections.
             */
            function createCard() {
                const cardId = `card-${cardCounter++}`;
                const card = document.createElement('div');
                card.id = cardId;
                card.className = 'draggable-card';
                card.textContent = `Card ${cardCounter}`;
                
                // Place new cards in a slightly random position
                card.style.left = `${Math.random() * 200 + 50}px`;
                card.style.top = `${Math.random() * 200 + 50}px`;

                scene.appendChild(card);

                // Make it draggable
                Draggable.create(card, {
                    bounds: scene,
                    onDrag: updateAllConnections, // Update lines in real-time while dragging
                    onPress: function() { gsap.to(this.target, {scale: 1.1}); },
                    onRelease: function() { gsap.to(this.target, {scale: 1.0}); }
                });
                
                // Add click listener to handle creating connections
                card.addEventListener('click', () => handleCardClick(card));
            }
            
            /**
             * Handles the logic for selecting cards to connect.
             */
            function handleCardClick(card) {
                if (!selectedCard) {
                    // This is the first card being selected
                    selectedCard = card;
                    card.classList.add('selected');
                } else if (selectedCard !== card) {
                    // A second, different card was clicked. Create the connection!
                    const fromId = selectedCard.id;
                    const toId = card.id;

                    // Prevent creating duplicate connections
                    const connectionExists = connections.some(conn => (conn.from === fromId && conn.to === toId) || (conn.from === toId && conn.to === fromId));
                    if(connectionExists) {
                        selectedCard.classList.remove('selected');
                        selectedCard = null;
                        return;
                    }

                    // Create a new SVG path element for this connection
                    const pathId = `path-${fromId}-${toId}`;
                    const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    newPath.id = pathId;
                    newPath.setAttribute('class', 'connector-path');
                    svg.appendChild(newPath);

                    // Store the connection info in our array
                    connections.push({ from: fromId, to: toId, pathId: pathId });

                    // Reset the selection and update the visuals
                    selectedCard.classList.remove('selected');
                    selectedCard = null;
                    updateAllConnections();
                } else {
                    // The same card was clicked again, so deselect it
                    selectedCard.classList.remove('selected');
                    selectedCard = null;
                }
            }
            
            // --- EVENT LISTENERS ---
            addCardBtn.addEventListener('click', createCard);
            window.addEventListener('resize', updateAllConnections); // Keep lines correct on resize

            // New feature from your code: Press 'F' to create a new card!
            document.addEventListener('keydown', (event) => {
                // We check if the user is typing in an input field, so we don't accidentally trigger it.
                if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                    return;
                }
                
                if (event.key === 'f' || event.key === 'F') {
                    createCard();
                }
            });

            // --- INITIALIZATION ---
            // Create a couple of cards to start with
            createCard();
            createCard();
        });