const sample = document.querySelector('#sample');
const output = document.querySelector('#result');

if (sample && output) {
  const sorter = new Intl.Collator('en-GB');
  const update = () => {
    const lines = sample.value.split(/\r\n|[\n\r\u2028\u2029]/u)
      .map(line => line.trim())
      .filter(Boolean);
    output.textContent = [...new Set(lines)].sort(sorter.compare).join('\n') || 'No lines to show.';
  };

  sample.addEventListener('input', update);
  update();
}

const formatInput = document.querySelector('#format-input');
const formatOutput = document.querySelector('#format-output');

if (formatInput && formatOutput) {
  const examples = {
    slug: ['A Better Way to Edit Text', 'a-better-way-to-edit-text'],
    snake: ['Editing Mode', 'editing_mode'],
    markdown: ['Apples\nPears\nPlums', '- Apples\n- Pears\n- Plums'],
    json: ['{"name":"Text Case","formats":77}', '{\n  "formats" : 77,\n  "name" : "Text Case"\n}']
  };

  const options = document.querySelectorAll('[name="format-example"]');
  const updateExample = () => {
    const selected = [...options].find(option => option.checked);
    const [input, result] = examples[selected.value];
    formatInput.textContent = input;
    formatOutput.textContent = result;
  };

  options.forEach(option => option.addEventListener('change', updateExample));
  updateExample();
}
