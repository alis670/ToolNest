// loadCurrencies.js
async function populateCurrencyDropdown(dropdownId) {
    try {
        const response = await fetch('currencies.json'); // path to currencies.json
        const currencies = await response.json();

        const dropdown = document.getElementById(dropdownId);
        if(!dropdown) return;

        // Clear existing options
        dropdown.innerHTML = '';

        // Add a placeholder option
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.text = 'Select Currency';
        dropdown.add(placeholder);

        currencies.forEach(c => {
            const option = document.createElement('option');
            option.value = c.code;
            option.innerHTML = `${c.code} (${c.symbol}) <img src="${c.flag}" alt="${c.code}" style="width:20px;height:15px;margin-left:5px;">`;
            dropdown.add(option);
        });
    } catch(err) {
        console.error('Error loading currencies:', err);
    }
}
