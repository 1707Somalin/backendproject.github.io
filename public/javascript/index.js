const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        document.querySelector("h1").onmouseover = event => {
            let iterations = 0;
            const headingInterval = setInterval(() => {
                event.target.innerText = event.target.innerText.split("")
                    .map((letter, index) => {
                        if (index < iterations) {
                            return event.target.dataset.value[index];
                        }

                        return letters[Math.floor(Math.random() * 26)]
                    })
                    .join("");

                if (iterations >= event.target.dataset.value.length) clearInterval(headingInterval);
                iterations = iterations + 1;

            }, 100);
        }