const toast = document.querySelector(".toast");
let toastTimeout;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1800);
}

function selectText(target) {
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(target);
  selection.removeAllRanges();
  selection.addRange(range);
}

function fallbackCopy(target) {
  selectText(target);
  const copied = document.execCommand("copy");
  return copied;
}

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    if (!target) return;

    const text = target.textContent.trim();
    let copied = false;

    copied = fallbackCopy(target);

    if (!copied && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (copied) {
      showToast("Mustertext kopiert.");
    } else {
      showToast("Text markiert.");
    }
  });
});
