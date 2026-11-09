import { gsap } from 'gsap';

// Segments lit by the 74LS47 BCD-to-7-segment decoder (its 6 and 9 have no tails).
const DIGITS = {
  0: 'abcdef',
  1: 'bc',
  2: 'abdeg',
  3: 'abcdg',
  4: 'bcfg',
  5: 'acdfg',
  6: 'cdefg',
  7: 'abc',
  8: 'abcdefg',
  9: 'abcfg',
};

const A_X = 178; // outer beam (outside side of the door)
const B_X = 222; // inner beam (room side)
const R = 26; // person radius, wider than the beam spacing so both beams are briefly blocked
const START = 40;
const END = 360;

export function initSimulator({ reduceMotion = false } = {}) {
  const root = document.getElementById('sim');
  if (!root) return;

  const $ = (sel) => root.querySelector(sel);
  const person = $('#sim-person');
  const beamA = $('#beam-a');
  const beamB = $('#beam-b');
  const ldrA = $('#ldr-a');
  const ldrB = $('#ldr-b');
  const statA = $('#stat-a');
  const statB = $('#stat-b');
  const statPulse = $('#stat-pulse');
  const segs = [...root.querySelectorAll('.seg7__s')];
  const bits = [...root.querySelectorAll('.bcd [data-bit]')];
  const countText = $('#sim-count');
  const zero = $('#sim-zero');
  const light = $('#sim-light');
  const fan = $('#sim-fan');
  const enterBtn = $('#sim-enter');
  const exitBtn = $('#sim-exit');
  const resetBtn = $('#sim-reset');
  const log = $('#sim-log');

  let count = 0;
  let busy = false;
  let aBlocked = false;
  let bBlocked = false;
  let pulseTimer = 0;

  const speedFor = (n) => (n === 0 ? null : n <= 3 ? ['Low', '1.5s'] : n <= 6 ? ['Medium', '0.75s'] : ['High', '0.32s']);

  function render() {
    const on = DIGITS[count];
    segs.forEach((s) => s.classList.toggle('on', on.includes(s.dataset.seg)));
    const bin = count.toString(2).padStart(4, '0'); // Q3 Q2 Q1 Q0
    bits.forEach((b) => {
      const v = bin[3 - Number(b.dataset.bit)] === '1';
      b.classList.toggle('on', v);
      b.textContent = v ? '1' : '0';
    });
    countText.textContent = `${count} ${count === 1 ? 'person' : 'people'}`;

    const occupied = count > 0;
    zero.textContent = occupied ? 'HIGH' : 'LOW';
    zero.classList.toggle('on', occupied);
    light.classList.toggle('is-on', occupied);
    fan.classList.toggle('is-on', occupied);
    light.querySelector('.load__state').textContent = occupied ? 'ON' : 'OFF';
    const speed = speedFor(count);
    fan.querySelector('.load__state').textContent = speed ? `ON · ${speed[0]}` : 'OFF';
    fan.style.setProperty('--fan-speed', speed ? speed[1] : '1s');

    enterBtn.disabled = busy || count >= 9;
    exitBtn.disabled = busy || count <= 0;
    resetBtn.disabled = busy || count === 0;
  }

  function say(text) {
    log.textContent = text;
  }

  function pulse(kind) {
    statPulse.textContent = kind === 'up' ? 'UP ▲' : 'DOWN ▼';
    statPulse.className = kind;
    clearTimeout(pulseTimer);
    pulseTimer = setTimeout(() => {
      statPulse.textContent = '—';
      statPulse.className = '';
    }, 1400);
  }

  function showBeams() {
    beamA.classList.toggle('blocked', aBlocked);
    beamB.classList.toggle('blocked', bBlocked);
    ldrA.classList.toggle('blocked', aBlocked);
    ldrB.classList.toggle('blocked', bBlocked);
    statA.textContent = aBlocked ? 'BLOCKED' : 'CLEAR';
    statB.textContent = bBlocked ? 'BLOCKED' : 'CLEAR';
    statA.classList.toggle('alert', aBlocked);
    statB.classList.toggle('alert', bBlocked);
  }

  /* Edge-triggered logic, mirroring the 74LS74 direction detector:
     rising edge of B samples A → entry (UP); rising edge of A samples B → exit (DOWN). */
  function applyAt(x) {
    const a = Math.abs(x - A_X) < R;
    const b = Math.abs(x - B_X) < R;
    if (a && !aBlocked) {
      if (b) {
        count = Math.max(0, count - 1);
        pulse('down');
        say(`Beam A broke while B was already blocked → exit → DOWN pulse. Count = ${count}.`);
      } else {
        say('Beam A (outer) interrupted…');
      }
    }
    if (b && !bBlocked) {
      if (a) {
        count = Math.min(9, count + 1);
        pulse('up');
        say(`Beam B broke while A was already blocked → entry → UP pulse. Count = ${count}.`);
      } else {
        say('Beam B (inner) interrupted…');
      }
    }
    aBlocked = a;
    bBlocked = b;
  }

  // Process every beam edge between two positions in travel order, so a slow frame can never skip one.
  function advance(from, to) {
    const dir = Math.sign(to - from);
    if (!dir) return;
    const edges = [A_X - R, A_X + R, B_X - R, B_X + R]
      .filter((t) => (dir > 0 ? t > from && t <= to : t < from && t >= to))
      .sort((p, q) => dir * (p - q));
    edges.forEach((t) => applyAt(t + dir * 0.01));
    applyAt(to);
  }

  function summary() {
    if (count === 0) return 'Room empty: zero-detect is LOW, so the light and fan are OFF.';
    const speed = speedFor(count)[0].toLowerCase();
    return `${count} ${count === 1 ? 'person' : 'people'} inside: light ON, fan ON at ${speed} speed.`;
  }

  function walk(direction) {
    if (busy) return;
    busy = true;
    render();
    const pos = { x: direction > 0 ? START : END };
    let prev = pos.x;
    person.setAttribute('transform', `translate(${pos.x} 0)`);
    gsap.to(person, { opacity: 1, duration: 0.2 });
    gsap.to(pos, {
      x: direction > 0 ? END : START,
      duration: reduceMotion ? 0.6 : 2.1,
      ease: 'none',
      onUpdate: () => {
        advance(prev, pos.x);
        prev = pos.x;
        person.setAttribute('transform', `translate(${pos.x.toFixed(1)} 0)`);
        showBeams();
        render();
      },
      onComplete: () => {
        busy = false;
        gsap.to(person, { opacity: 0, duration: 0.35 });
        say(summary());
        render();
      },
    });
  }

  enterBtn.addEventListener('click', () => walk(1));
  exitBtn.addEventListener('click', () => walk(-1));
  resetBtn.addEventListener('click', () => {
    if (busy) return;
    count = 0;
    say('Counter cleared. Room empty: light and fan OFF.');
    render();
  });

  render();
  showBeams();
}
