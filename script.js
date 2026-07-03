const platformTabs = [...document.querySelectorAll("[data-platform-tab]")];
const platformPanels = [...document.querySelectorAll("[data-platform-panel]")];
const platformLinks = [...document.querySelectorAll("[data-select-platform]")];
const toast = document.querySelector(".toast");
let toastTimeout;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

function selectPlatform(platform, shouldScroll = false) {
  platformTabs.forEach((tab) => {
    const isSelected = tab.dataset.platformTab === platform;
    tab.classList.toggle("is-active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
  });

  platformPanels.forEach((panel) => {
    const isSelected = panel.dataset.platformPanel === platform;
    panel.classList.toggle("is-active", isSelected);
    panel.hidden = !isSelected;
  });

  if (shouldScroll) {
    document.getElementById(platform)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function fallbackCopy(text) {
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.top = "-999px";
  field.style.left = "-999px";
  document.body.appendChild(field);
  field.select();
  const copied = document.execCommand("copy");
  field.remove();
  return copied;
}

platformTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const platform = tab.dataset.platformTab;
    selectPlatform(platform);
    history.replaceState(null, "", `#${platform}`);
  });
});

platformLinks.forEach((link) => {
  link.addEventListener("click", () => {
    selectPlatform(link.dataset.selectPlatform);
  });
});

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    if (!target) return;

    const text = target.textContent.trim();
    let copied = false;
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch {
      copied = fallbackCopy(text);
    }

    if (copied) {
      button.classList.add("is-copied");
      button.setAttribute("title", "Kopiert");
      showToast("Mustertext kopiert.");
    } else {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(target);
      selection.removeAllRanges();
      selection.addRange(range);
      showToast("Text markiert. Jetzt kopieren.");
    }

    window.setTimeout(() => {
      button.classList.remove("is-copied");
      button.setAttribute("title", "Kopieren");
    }, 1800);
  });
});

if (location.hash === "#tiktok") {
  selectPlatform("tiktok");
}

window.addEventListener("hashchange", () => {
  if (location.hash === "#meta" || location.hash === "#tiktok") {
    selectPlatform(location.hash.slice(1));
  }
});

window.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
