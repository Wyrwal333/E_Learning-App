document.addEventListener("DOMContentLoaded", () => {
    // === OBSŁUGA DRAG & DROP ===
    const dndItems = document.querySelectorAll(".dnd-item");
    const dndBoxes = document.querySelectorAll(".dnd-box");

    dndItems.forEach(item => {
        item.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", e.target.id);
        });
    });

    dndBoxes.forEach(box => {
        box.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        box.addEventListener("drop", (e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData("text/plain");
            const draggedElement = document.getElementById(id);
            
            // Upewniamy się, że element ląduje bezpośrednio w kontenerze dnd-box
            if (e.target.classList.contains("dnd-box")) {
                e.target.appendChild(draggedElement);
            } else if (e.target.closest(".dnd-box")) {
                e.target.closest(".dnd-box").appendChild(draggedElement);
            }
        });
    });

    // === OBSŁUGA FISZEK ===
    const flashcards = document.querySelectorAll(".flashcard");
    flashcards.forEach(card => {
        card.addEventListener("click", () => {
            card.classList.toggle("flipped");
        });
    });

    // === SPRAWDZANIE WYNIKÓW ===
    const submitBtn = document.getElementById("submit-btn");
    submitBtn.addEventListener("click", sprawdzWynik);

    function sprawdzWynik() {
        let punkty = 0;
        
        // 1. Sprawdzanie Quizu (Max 3 pkt)
        const q1 = document.querySelector('input[name="q1"]:checked');
        const q2 = document.querySelector('input[name="q2"]:checked');
        const q3 = document.querySelector('input[name="q3"]:checked');
        
        if (q1 && q1.value === "c") punkty++;
        if (q2 && q2.value === "b") punkty++;
        if (q3 && q3.value === "a") punkty++;

        // 2. Sprawdzanie Drag & Drop (2 pkt)
        const targetZone = document.getElementById('target-zone');
        const droppedItems = targetZone.querySelectorAll('.dnd-item');
        
        let ulozonaKolejnosc = "";
        droppedItems.forEach(item => {
            ulozonaKolejnosc += item.getAttribute('data-id');
        });
        
        // Oczekiwana kolejność: 1 (fun), 2 (parametry), 3 (: Int {), 4 (return), 5 (})
        if (ulozonaKolejnosc === "12345") {
            punkty += 2;
        }

        // 3. Sprawdzanie uzupełniania kodu (Max 3 pkt)
        const b1 = document.getElementById('blank1').value.trim().toLowerCase();
        const b2 = document.getElementById('blank2').value.trim();
        const b3 = document.getElementById('blank3').value.trim().toLowerCase();

        if (b1 === "fun") punkty++;
        if (b2 === ":") punkty++;
        if (b3 === "return") punkty++;

        // 4. Aktualizacja widoku podsumowania
        const wynikContainer = document.getElementById('wynik-container');
        const wynikPunkty = document.getElementById('wynik-punkty');
        const wynikKomentarz = document.getElementById('wynik-komentarz');

        wynikContainer.style.display = 'block';
        wynikPunkty.innerText = `Twój wynik: ${punkty} / 8 punktów`;

        // Kolorowanie sekcji wyniku i dopasowanie komentarza
        if (punkty <= 3) {
            wynikContainer.style.backgroundColor = '#ffebee';
            wynikContainer.style.border = '2px solid #ef5350';
            wynikKomentarz.innerText = "Musisz jeszcze poćwiczyć. Wróć do sekcji teoretycznej i spróbuj ponownie!";
            wynikKomentarz.style.color = '#c62828';
        } else if (punkty <= 6) {
            wynikContainer.style.backgroundColor = '#fff3e0';
            wynikContainer.style.border = '2px solid #ffca28';
            wynikKomentarz.innerText = "Niezły wynik! Znasz już podstawy funkcji w Kotlinie, ale masz pole do poprawy.";
            wynikKomentarz.style.color = '#f57c00';
        } else {
            wynikContainer.style.backgroundColor = '#e8f5e9';
            wynikContainer.style.border = '2px solid #66bb6a';
            wynikKomentarz.innerText = "Świetna robota! Jesteś mistrzem funkcji w Kotlinie!";
            wynikKomentarz.style.color = '#2e7d32';
        }
        
        // Przewiń widok do podsumowania po kliknięciu
        wynikContainer.scrollIntoView({ behavior: 'smooth' });
    }
});