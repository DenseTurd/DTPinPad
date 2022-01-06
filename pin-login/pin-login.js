class PinLogin {
    constructor({el, loginEndPoint, redirectTo, maxNumbers = Infinity}) {
    this.el = {
            main: el,
            textDisplay: el.querySelector(".pin-login__text"),
            numPad: el.querySelector(".pin-login__numpad")
        };

        this.loginEndPoint = loginEndPoint;
        this.redirectTo = redirectTo;
        this.maxNumbers = maxNumbers;
        this.value = "";
    
        this._generatePad();
    }

    _generatePad() {
        const padLayout = [
            "1", "2", "3",
            "4", "5", "6",
            "7", "8", "9",
            "backspace", "0", "done",
        ];

        padLayout.forEach(key => {
            const insertBreak = key.search(/[369]/) !== -1;
            const keyEl = document.createElement("div");

            keyEl.classList.add("pin-login__key");
            keyEl.classList.toggle("material-icons", isNaN(key));
            keyEl.textContent = key;
            keyEl.addEventListener("click", () => { this._handleKeyPress(key) })
            this.el.numPad.appendChild(keyEl);

            if (insertBreak) {
                this.el.numPad.appendChild(document.createElement("br"));        
            }
        });
    }

    _handleKeyPress(key) {
        switch (key) {
            case "backspace":
                this.value = this.value.substring(0, this.value.length -1);
                break;
            case "done":
                //this._attemptLogin(); // no workey
                this._attemptBSLogin();
                break;
            default:
                if (this.value.length < this.maxNumbers && !isNaN(key)) {
                    this.value += key;
                }
                break;
        }

        this._updateValueText();
    }

    _updateValueText() {
        // don't put the value in the tet display as you can get it in 
        // the console with: document.querySelector(".pin-login__text").value
        // instead just put any ole char for each number
        this.el.textDisplay.value = "_".repeat(this.value.length);
        this.el.textDisplay.classList.remove("pin-login__text--error");

    }

    _attemptLogin() {
        if (this.value.length > 0) {
            fetch(this.loginEndPoint, {
                method: "post", // no workeys
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body:  `pincode=${this.value}`
            }).then(response => {
                if (response.status === 200) {
                    widonw.location.href = this.redirectTo;
                } else {
                    this.el.textDisplay.classList.add("pin-login__text--error");
                }
            });
        }
    }

    async _attemptBSLogin() {
        if (this.value.length > 0) {
            await this._BSCodecheck(this.value)
            .catch(err => console.log(err))
            .then(response => {
                if (response === "Success") {
                    window.location.href = this.redirectTo;
                } else {
                    this.el.textDisplay.classList.add("pin-login__text--error");
                }
            });
        }
    }

    async _BSCodecheck(code) {
        return new Promise((fulfill, reject) => {
            setTimeout(async () => {
                if (code === "1234") {
                    fulfill("Success");
                } else {
                    reject("Wrong pin");
                }
            }, 200);
        });
    }
}