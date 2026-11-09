"use strict";
(() => {
  const marker = document.querySelector('[data-post-views][data-record-view="true"]');
  const article = document.querySelector("article.blog-post");
  if (!marker || !article) return;
  const slug = marker.dataset.postViews;
  if (!slug) return;
  let section = document.querySelector("[data-comments-post]");
  if (!section) {
    section = document.createElement("section");
    section.className = "reader-comments reading-column";
    section.id = "comments";
    section.dataset.commentsPost = slug;
    section.setAttribute("aria-labelledby", "comments-title");
    section.innerHTML = '<h2 id="comments-title">Comments</h2><div data-comments-content></div>';
    article.insertAdjacentElement("afterend", section);
  }
  const content = section.querySelector("[data-comments-content]");
  if (!content) return;
  content.innerHTML = [
    '<p class="comments-intro">Join the conversation. Your name and comment will be public.</p>',
    '<form class="comment-form" data-comment-form>',
    '<div class="comment-field"><label for="comment-name">Name</label>',
    '<input id="comment-name" name="name" type="text" required maxlength="80" autocomplete="name"></div>',
    '<div class="comment-field"><label for="comment-body">Comment</label>',
    '<textarea id="comment-body" name="body" rows="5" required minlength="3" maxlength="3000" aria-describedby="comment-note"></textarea>',
    '<p id="comment-note" class="comment-note">Please keep the discussion respectful. Up to 3,000 characters.</p></div>',
    '<div class="comment-website" aria-hidden="true"><label for="comment-website">Website</label>',
    '<input id="comment-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>',
    '<button class="comment-submit" type="submit">Post comment</button>',
    '<p class="comment-feedback" data-comment-feedback role="status" aria-live="polite"></p></form>',
    '<div class="comments-discussion"><h3>Reader comments</h3>',
    '<p data-comments-status role="status" aria-live="polite">Loading comments…</p>',
    '<button class="text-button" type="button" data-comments-retry hidden>Try loading comments again</button>',
    '<ol class="reader-comment-list" data-comments-list aria-label="Reader comments"></ol>',
    '<button class="text-button" type="button" data-comments-more hidden>Load earlier comments</button></div>'
  ].join("");
  const form = content.querySelector("form");
  const nameInput = form.elements.namedItem("name");
  const bodyInput = form.elements.namedItem("body");
  const submit = form.querySelector('[type="submit"]');
  const feedback = content.querySelector("[data-comment-feedback]");
  const status = content.querySelector("[data-comments-status]");
  const retry = content.querySelector("[data-comments-retry]");
  const more = content.querySelector("[data-comments-more]");
  const list = content.querySelector("[data-comments-list]");
  const endpoint = "https://obaidullah-blog-views.patientfort.chatgpt.site/api/comments?post=" + encodeURIComponent(slug);
  let nextCursor = null;
  let reading = false;
  let submitting = false;
  let submission = null;
  const shown = new Set();
  const recentlyPosted = new Map();
  const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });
  const makeId = () => {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
    return hex.slice(0,8) + "-" + hex.slice(8,12) + "-" + hex.slice(12,16) + "-" + hex.slice(16,20) + "-" + hex.slice(20);
  };
  function validComment(comment) {
    return comment && typeof comment.id === "string" && typeof comment.name === "string" &&
      typeof comment.body === "string" && typeof comment.createdAt === "string" &&
      Number.isFinite(Date.parse(comment.createdAt));
  }
  function commentNode(comment) {
    const item = document.createElement("li");
    item.className = "reader-comment";
    const heading = document.createElement("div");
    heading.className = "reader-comment-heading";
    const author = document.createElement("strong");
    author.textContent = comment.name;
    const time = document.createElement("time");
    time.dateTime = comment.createdAt;
    time.textContent = dateFormat.format(new Date(comment.createdAt));
    const body = document.createElement("p");
    body.textContent = comment.body;
    heading.append(author, time);
    item.append(heading, body);
    return item;
  }
  async function request(url, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(url, {
        credentials: "omit", cache: "no-store", referrerPolicy: "no-referrer",
        ...options, signal: controller.signal
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Comments are temporarily unavailable. Please try again.");
      return data;
    } catch (error) {
      if (error.name === "AbortError" || error instanceof TypeError || error instanceof SyntaxError) {
        throw new Error("Couldn’t connect. Your draft is still here; please try again.");
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
  async function loadComments(append = false) {
    if (reading) return;
    reading = true;
    retry.hidden = true;
    more.disabled = true;
    status.textContent = "Loading comments…";
    try {
      const data = await request(endpoint + (append && nextCursor ? "&cursor=" + encodeURIComponent(nextCursor) : ""));
      if (data.post !== slug || !Array.isArray(data.comments) || !data.comments.every(validComment)) {
        throw new Error("Couldn’t load comments. Please try again.");
      }
      if (!append) { list.replaceChildren(); shown.clear(); }
      const comments = append ? data.comments : [...recentlyPosted.values(), ...data.comments].sort((a, b) =>
        Date.parse(b.createdAt) - Date.parse(a.createdAt) || b.id.localeCompare(a.id));
      for (const comment of comments) {
        if (shown.has(comment.id)) continue;
        shown.add(comment.id);
        list.append(commentNode(comment));
      }
      nextCursor = typeof data.nextCursor === "string" ? data.nextCursor : null;
      more.hidden = !nextCursor;
      status.textContent = shown.size ? "" : "No comments yet. Be the first to join the conversation.";
    } catch (error) {
      status.textContent = "Couldn’t load comments. Please try again.";
      retry.hidden = false;
    } finally {
      reading = false;
      more.disabled = false;
    }
  }
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (submitting || !form.reportValidity()) return;
    const name = nameInput.value.trim();
    const body = bodyInput.value.trim();
    if (!name || body.length < 3) {
      feedback.textContent = "Please enter your name and a comment of at least 3 characters.";
      return;
    }
    const signature = JSON.stringify({name, body});
    if (!submission || submission.signature !== signature) submission = { signature, id: makeId() };
    submitting = true;
    submit.disabled = true;
    submit.textContent = "Posting…";
    feedback.textContent = "";
    feedback.dataset.state = "";
    try {
      const data = await request(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: submission.id, name, body, website: form.elements.namedItem("website").value })
      });
      if (data.post !== slug || !validComment(data.comment)) throw new Error("Couldn’t confirm your comment. Please try again.");
      recentlyPosted.set(data.comment.id, data.comment);
      if (!shown.has(data.comment.id)) {
        list.prepend(commentNode(data.comment));
        shown.add(data.comment.id);
      }
      if (!reading) status.textContent = "";
      form.reset();
      submission = null;
      feedback.dataset.state = "success";
      feedback.textContent = "Your comment has been posted. Thank you!";
    } catch (error) {
      feedback.dataset.state = "error";
      feedback.textContent = error.message || "Couldn’t post your comment. Your draft is still here; please try again.";
    } finally {
      submitting = false;
      submit.disabled = false;
      submit.textContent = "Post comment";
    }
  });
  retry.addEventListener("click", () => loadComments());
  more.addEventListener("click", () => loadComments(true));
  loadComments();
})();
