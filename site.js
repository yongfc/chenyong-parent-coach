(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var copy = {
    drive: {
      name: "内驱力",
      title: "更靠近内驱力",
      paras: [
        "孩子不愿意开始，很少只是因为懒。任务太大、怕做错，或是习惯了被催之后，自己想做的理由会变少。",
        "可以一起看：孩子在意什么，什么时候比较愿意试，你的哪一种反应会让孩子退后。希望行动从孩子自己的理由里长出来，而不是靠更大的声音。"
      ]
    },
    study: {
      name: "学习力",
      title: "更靠近学习力",
      paras: [
        "时间花了，方法不一定在。咨询里会看作业怎么拆开、不会的题先问什么、错了之后怎么回看，以及作息是否让第二天还能学。",
        "你不需要变成另一位老师。需要分清的是：哪一步让孩子自己完成，哪一步要把做法讲具体。孩子知道下一小步怎么做，比再多坐一会儿更有用。"
      ]
    },
    life: {
      name: "生命力",
      title: "更靠近生命力",
      paras: [
        "学习要持续，生活里得有余量。睡眠、吃饭、运动、情绪，还有亲子之间的气氛，都会带到第二天的学习里。",
        "可以一起看家里一天大概怎么过：什么已经太满，什么可以留白。不是把日子过成轻松，而是让孩子还有力气去学。"
      ]
    }
  };

  function setOpen(btn, open) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (!panel) return;
    panel.classList.toggle("is-open", open);
    panel.setAttribute("aria-hidden", open ? "false" : "true");
  }

  function jumpTo(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var btn = el.querySelector("[data-acc]");
    if (btn) setOpen(btn, true);
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    document.querySelectorAll(".is-lit").forEach(function (node) {
      node.classList.remove("is-lit");
    });
    el.classList.add("is-lit");
    window.clearTimeout(jumpTo.timer);
    jumpTo.timer = window.setTimeout(function () {
      el.classList.remove("is-lit");
    }, 1800);
  }

  document.querySelectorAll("[data-acc]").forEach(function (btn) {
    setOpen(btn, false);
    btn.addEventListener("click", function () {
      setOpen(btn, btn.getAttribute("aria-expanded") !== "true");
    });
  });

  document.querySelectorAll("[data-jump]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      jumpTo(link.getAttribute("data-jump"));
    });
  });

  var quiz = document.querySelector("[data-quiz]");
  if (quiz) {
    var steps = Array.prototype.slice.call(quiz.querySelectorAll("[data-step]"));
    var actions = quiz.querySelector("[data-quiz-actions]");
    var next = quiz.querySelector("[data-next]");
    var back = quiz.querySelector("[data-back]");
    var progress = document.querySelector("[data-progress]");
    var result = document.querySelector("[data-result]");
    var index = 0;

    function checkedIn(step) {
      return step.querySelector("input:checked");
    }

    function paint() {
      steps.forEach(function (step, i) {
        step.hidden = i !== index;
      });
      if (actions) actions.hidden = false;
      if (progress) {
        progress.hidden = false;
        progress.textContent = (index + 1) + " / " + steps.length;
      }
      if (back) back.hidden = index === 0;
      if (next) {
        next.disabled = !checkedIn(steps[index]);
        next.textContent = index === steps.length - 1 ? "看这段观察" : "下一题";
      }
      if (result) result.hidden = true;
    }

    function addParagraphs(parent, paras) {
      paras.forEach(function (text) {
        var p = document.createElement("p");
        p.textContent = text;
        parent.appendChild(p);
      });
    }

    function showResult() {
      var scores = { drive: 0, study: 0, life: 0 };
      steps.forEach(function (step) {
        var picked = checkedIn(step);
        if (picked && scores[picked.value] !== undefined) scores[picked.value] += 1;
      });
      var top = 0;
      Object.keys(scores).forEach(function (key) {
        if (scores[key] > top) top = scores[key];
      });
      var winners = Object.keys(scores).filter(function (key) {
        return scores[key] === top && top > 0;
      });
      result.replaceChildren();
      var kicker = document.createElement("p");
      kicker.className = "kicker";
      kicker.textContent = "一段观察";
      var title = document.createElement("h3");
      var note = document.createElement("p");
      note.className = "note";
      note.textContent = "这是帮你留意眼前的事，不是测试，也不给孩子下结论。";
      var links = document.createElement("p");
      links.className = "result-links";

      if (winners.length === 1) {
        var one = copy[winners[0]];
        title.textContent = one.title;
        result.append(kicker, title);
        addParagraphs(result, one.paras);
      } else {
        title.textContent = "这几件事叠在一起";
        var lead = document.createElement("p");
        lead.textContent = "你的选择没有单独落在一边。下面几段都来自这一页，可以先看最想谈的那一件。";
        result.append(kicker, title, lead);
        winners.forEach(function (key) {
          var block = document.createElement("div");
          block.className = "result-block";
          var h = document.createElement("h4");
          h.textContent = copy[key].name;
          block.appendChild(h);
          addParagraphs(block, copy[key].paras);
          var jump = document.createElement("a");
          jump.href = "#" + key;
          jump.setAttribute("data-jump", key);
          jump.textContent = "看「" + copy[key].name + "」";
          jump.addEventListener("click", function (event) {
            event.preventDefault();
            jumpTo(key);
          });
          block.appendChild(jump);
          result.appendChild(block);
        });
      }

      var consult = document.createElement("a");
      consult.href = "#consult";
      consult.textContent = "看咨询怎么谈";
      var wechat = document.createElement("a");
      wechat.href = "#contact";
      wechat.textContent = "加微信";
      var again = document.createElement("button");
      again.type = "button";
      again.className = "btn ghost";
      again.textContent = "再看一次";
      again.addEventListener("click", function () {
        quiz.querySelectorAll("input").forEach(function (input) {
          input.checked = false;
        });
        index = 0;
        result.hidden = true;
        result.replaceChildren();
        paint();
      });
      if (winners.length === 1) {
        var see = document.createElement("a");
        see.href = "#" + winners[0];
        see.textContent = "看这一段";
        see.addEventListener("click", function (event) {
          event.preventDefault();
          jumpTo(winners[0]);
        });
        links.append(see, consult, wechat, again);
      } else {
        links.append(consult, wechat, again);
      }
      result.append(note, links);
      steps.forEach(function (step) { step.hidden = true; });
      if (actions) actions.hidden = true;
      if (progress) progress.hidden = true;
      result.hidden = false;
      result.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }

    steps.forEach(function (step) {
      step.addEventListener("change", function () {
        if (next && step === steps[index]) next.disabled = !checkedIn(step);
      });
    });

    if (next) {
      next.addEventListener("click", function () {
        if (!checkedIn(steps[index])) return;
        if (index === steps.length - 1) showResult();
        else {
          index += 1;
          paint();
        }
      });
    }
    if (back) {
      back.addEventListener("click", function () {
        if (index === 0) return;
        index -= 1;
        paint();
      });
    }
    paint();
  }

  var navLinks = document.querySelectorAll("[data-nav]");
  var sections = ["consult", "ai", "contact"].map(function (id) {
    return document.getElementById(id);
  }).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          if (link.getAttribute("href") === "#" + entry.target.id) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    sections.forEach(function (section) { spy.observe(section); });
  }

  var reveals = document.querySelectorAll(".reveal");
  if (!reduce && "IntersectionObserver" in window) {
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        seen.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { seen.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  var frame = document.querySelector("[data-qr]");
  if (frame) {
    var files = [
      "assets/wechat-qr.png",
      "assets/wechat-qr.jpg",
      "assets/wechat-qr.jpeg",
      "assets/wechat-qr.webp"
    ];
    var tryAt = function (i) {
      if (i >= files.length) return;
      var img = new Image();
      img.alt = "陈咏的微信二维码";
      img.onload = function () {
        frame.classList.add("has-image");
        frame.replaceChildren(img);
        var note = document.querySelector("[data-qr-note]");
        if (note) note.remove();
      };
      img.onerror = function () { tryAt(i + 1); };
      img.src = files[i];
    };
    tryAt(0);
  }
})();
