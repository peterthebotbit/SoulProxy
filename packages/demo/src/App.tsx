import { css, type Component } from "dreamland/core";
import FlagEditor from "./components/FlagEditor";
import BrowserView from "./pages/BrowserView";
import RequestViewer from "./pages/RequestViewer";
import PlaygroundView from "./pages/Playground";
import SettingsView from "./pages/SettingsPage";
import { Omnibox } from "./pages/BrowserView";
import { requestsState } from "./pages/RequestViewer";

const App: Component<
	{},
	{},
	{
		activeTab: "browser" | "requests" | "playground" | "settings";
		showIntro: boolean;
		clock: string;
		batteryLevel: number;
	}
> = function (cx) {
	this.activeTab ??= "browser";
	this.showIntro ??= true;
	this.clock ??= new Date().toLocaleTimeString([], {
		hour: "numeric",
		minute: "2-digit",
	});
	this.batteryLevel ??= 87;

	cx.mount = () => {
		const tick = () => {
			const now = new Date();
			this.clock = now.toLocaleTimeString([], {
				hour: "numeric",
				minute: "2-digit",
			});
			this.batteryLevel = Math.max(
				18,
				Math.min(100, this.batteryLevel + (Math.random() > 0.5 ? 1 : -1))
			);
		};
		tick();
		const timer = window.setInterval(tick, 1000);
		const introTimer = window.setTimeout(() => {
			this.showIntro = false;
		}, 3400);
		return () => {
			window.clearInterval(timer);
			window.clearTimeout(introTimer);
		};
	};

	return (
		<div class="app-shell">
			<div class="ambient-layer" aria-hidden="true">
				<div class="sun-glow"></div>
				<div class="wave-line line-a"></div>
				<div class="wave-line line-b"></div>
				<div class="particle p1"></div>
				<div class="particle p2"></div>
				<div class="particle p3"></div>
			</div>
			<div class="top-bar">
				<div class="top-brand">
					<div class="brand-mark"></div>
					<div>
						<div class="brand-title">Soul Proxy</div>
						<div class="brand-subtitle">calm browsing • soft signals</div>
					</div>
				</div>
				<div class="hero-center">
					<div class="time-pill">{use(this.clock)}</div>
					<div class="welcome-pill">Welcome to Soul Proxy</div>
				</div>
				<div class="top-actions">
					<FlagEditor inline={true} />
				</div>
			</div>
			<div class="header-strip">
				<div class="tab-bar">
					<button
						class={use(this.activeTab).map(
							(tab) => `tab-button ${tab === "browser" ? "active" : ""}`
						)}
						on:click={() => {
							this.activeTab = "browser";
						}}
					>
						Browser
					</button>
					<button
						class={use(this.activeTab).map(
							(tab) => `tab-button ${tab === "requests" ? "active" : ""}`
						)}
						on:click={() => {
							this.activeTab = "requests";
						}}
					>
						Requests{" "}
						{use(requestsState.requests).map((requests) =>
							requests.length ? `(${requests.length})` : ""
						)}
					</button>
					<button
						class={use(this.activeTab).map(
							(tab) => `tab-button ${tab === "playground" ? "active" : ""}`
						)}
						on:click={() => {
							this.activeTab = "playground";
						}}
					>
						Playground
					</button>
					<button
						class={use(this.activeTab).map(
							(tab) => `tab-button ${tab === "settings" ? "active" : ""}`
						)}
						on:click={() => {
							this.activeTab = "settings";
						}}
					>
						Settings
					</button>
				</div>
				{use(this.activeTab)
					.map((tab) => tab === "browser")
					.andThen(<Omnibox />)}
			</div>
			<div class="panel-stack">
				<div
					class={use(this.activeTab).map(
						(tab) =>
							`tab-panel browser-panel ${tab === "browser" ? "active" : ""}`
					)}
				>
					<BrowserView
						active={use(this.activeTab).map((tab) => tab === "browser")}
					/>
				</div>
				<div
					class={use(this.activeTab).map(
						(tab) =>
							`tab-panel requests-panel ${tab === "requests" ? "active" : ""}`
					)}
				>
					<RequestViewer
						active={use(this.activeTab).map((tab) => tab === "requests")}
					/>
				</div>
				<div
					class={use(this.activeTab).map(
						(tab) =>
							`tab-panel playground-panel ${tab === "playground" ? "active" : ""}`
					)}
				>
					<PlaygroundView
						active={use(this.activeTab).map((tab) => tab === "playground")}
					/>
				</div>
				<div
					class={use(this.activeTab).map(
						(tab) =>
							`tab-panel settings-tab ${tab === "settings" ? "active" : ""}`
					)}
				>
					<SettingsView />
				</div>
			</div>
			<div class="bottom-dock">
				<button
					class={use(this.activeTab).map(
						(tab) => `dock-btn ${tab === "browser" ? "active" : ""}`
					)}
					on:click={() => {
						this.activeTab = "browser";
					}}
				>
					<span class="material-symbols-outlined">language</span>
					<span>Browser</span>
				</button>
				<button
					class={use(this.activeTab).map(
						(tab) => `dock-btn ${tab === "settings" ? "active" : ""}`
					)}
					on:click={() => {
						this.activeTab = "settings";
					}}
				>
					<span class="material-symbols-outlined">tune</span>
					<span>Settings</span>
				</button>
				<button
					class={use(this.activeTab).map(
						(tab) => `dock-btn ${tab === "settings" ? "active" : ""}`
					)}
					on:click={() => {
						this.activeTab = "settings";
					}}
				>
					<span class="material-symbols-outlined">router</span>
					<span>Proxy Settings</span>
				</button>
				<div class="dock-status">
					<div class="battery-pill">
						<span class="material-symbols-outlined">battery_charging_full</span>
						<span>{use(this.batteryLevel).map((value) => `${value}%`)}</span>
					</div>
				</div>
			</div>
			{use(this.showIntro).map((show) =>
				show ? (
					<div class="intro-overlay">
						<div class="intro-card">
							<div class="intro-badge">Soul Proxy</div>
							<h1>Welcome back to the calm web.</h1>
							<p>
								Soft light, wavy motion, and a quiet proxy shell built for smooth
								travel through the web.
							</p>
						</div>
					</div>
				) : null
			)}
		</div>
	);
};

App.style = css`
	@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,400,0,0");

	:scope {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		margin: 0;
		overflow: hidden;
		position: absolute;
		top: 0;
		left: 0;
		padding: 0;
		background: radial-gradient(circle at top, #141414 0%, #050505 55%, #000 100%);
		box-sizing: border-box;
		font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
			"Segoe UI", sans-serif;
		color: #f2f2f2;
	}
	.material-symbols-outlined {
		font-family: "Material Symbols Outlined";
		font-weight: normal;
		font-style: normal;
		font-size: 14px;
		line-height: 1;
		letter-spacing: normal;
		text-transform: none;
		display: inline-block;
		white-space: nowrap;
		word-wrap: normal;
		direction: ltr;
		-webkit-font-smoothing: antialiased;
	}
	.app-shell {
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.ambient-layer {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 0;
	}
	.sun-glow {
		position: absolute;
		top: -14vh;
		left: 50%;
		transform: translateX(-50%);
		width: 56vw;
		height: 56vw;
		max-width: 760px;
		max-height: 760px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(140,140,140,0.08) 25%, transparent 70%);
		filter: blur(12px);
		animation: pulseGlow 8s ease-in-out infinite;
	}
	.wave-line {
		position: absolute;
		left: -10%;
		right: -10%;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent);
		animation: driftWave 12s linear infinite;
	}
	.line-a {
		top: 18%;
		transform: rotate(-5deg);
	}
	.line-b {
		top: 74%;
		transform: rotate(4deg);
		animation-duration: 16s;
	}
	.particle {
		position: absolute;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: rgba(255,255,255,0.45);
		box-shadow: 0 0 12px rgba(255,255,255,0.2);
		animation: floatParticle 9s ease-in-out infinite;
	}
	.p1 { top: 18%; left: 16%; animation-delay: 0s; }
	.p2 { top: 36%; right: 18%; animation-delay: 2.2s; }
	.p3 { bottom: 24%; left: 24%; animation-delay: 4.4s; }
	.top-bar {
		position: relative;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.1rem 0.75rem;
		background: linear-gradient(180deg, rgba(12,12,12,0.92) 0%, rgba(8,8,8,0.7) 100%);
		backdrop-filter: blur(18px);
	}
	.top-brand {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		min-width: 0;
	}
	.brand-mark {
		width: 0.9rem;
		height: 0.9rem;
		border-radius: 50%;
		border: 1px solid rgba(255,255,255,0.7);
		box-shadow: 0 0 14px rgba(255,255,255,0.24);
		background: linear-gradient(135deg, #d8d8d8, #666);
	}
	.brand-title {
		font-size: 0.95rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	.brand-subtitle {
		font-size: 0.72rem;
		color: #8d8d8d;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.hero-center {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.28rem;
		flex: 1;
		min-width: 0;
	}
	.time-pill,
	.welcome-pill {
		padding: 0.34rem 0.7rem;
		border-radius: 999px;
		border: 1px solid rgba(255,255,255,0.16);
		background: rgba(255,255,255,0.05);
		backdrop-filter: blur(10px);
		box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
	}
	.time-pill {
		font-size: 0.84rem;
		font-variant-numeric: tabular-nums;
		color: #f3f3f3;
	}
	.welcome-pill {
		font-size: 0.68rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: #b2b2b2;
	}
	.top-actions {
		display: flex;
		align-items: center;
		margin-left: auto;
		padding: 0 0.12rem;
	}
	.header-strip {
		position: relative;
		z-index: 2;
		display: flex;
		align-items: center;
		gap: 0.7rem;
		padding: 0.4rem 0.95rem 0.7rem;
		background: rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(12px);
	}
	.tab-bar {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		flex: 1;
		min-width: 0;
		overflow-x: auto;
	}
	.tab-button {
		border: 1px solid rgba(255,255,255,0.12);
		background: rgba(255,255,255,0.04);
		color: #a8a8a8;
		padding: 0.24rem 0.62rem;
		border-radius: 999px;
		cursor: pointer;
		font-size: 0.76rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		line-height: 1.2;
		min-height: 28px;
		margin: 0;
		white-space: nowrap;
		display: inline-flex;
		align-items: center;
		transition: all 180ms ease;
	}
	.tab-button:hover {
		background: rgba(255,255,255,0.08);
		color: #f0f0f0;
		transform: translateY(-1px);
	}
	.tab-button.active {
		background: rgba(255,255,255,0.14);
		color: #fff;
		border-color: rgba(255,255,255,0.22);
		box-shadow: 0 0 12px rgba(255,255,255,0.08);
	}
	.panel-stack {
		position: relative;
		z-index: 1;
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
	}
	.tab-panel {
		flex: 1;
		width: 100%;
		min-width: 0;
		min-height: 0;
		display: none;
	}
	.tab-panel.active {
		display: flex;
	}
	.requests-panel {
		flex-direction: column;
	}
	.playground-panel {
		width: 100%;
		min-width: 0;
		min-height: 0;
	}
	.settings-tab {
		width: 100%;
		min-width: 0;
		min-height: 0;
	}
	.bottom-dock {
		position: relative;
		z-index: 3;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.55rem;
		padding: 0.75rem 1rem 1rem;
		background: linear-gradient(180deg, rgba(6,6,6,0.18) 0%, rgba(0,0,0,0.72) 100%);
		backdrop-filter: blur(18px);
	}
	.dock-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		padding: 0.5rem 0.72rem;
		border-radius: 999px;
		border: 1px solid rgba(255,255,255,0.16);
		background: rgba(255,255,255,0.05);
		color: #ececec;
		cursor: pointer;
		transition: all 180ms ease;
		animation: floatButton 4.8s ease-in-out infinite;
	}
	.dock-btn:nth-child(2) {
		animation-delay: 1.1s;
	}
	.dock-btn:nth-child(3) {
		animation-delay: 2.2s;
	}
	.dock-btn:hover {
		transform: translateY(-2px);
		background: rgba(255,255,255,0.11);
		box-shadow: 0 12px 22px rgba(0,0,0,0.22);
	}
	.dock-btn.active {
		background: rgba(255,255,255,0.16);
		border-color: rgba(255,255,255,0.28);
		box-shadow: 0 0 18px rgba(255,255,255,0.1);
	}
	.dock-status {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin-left: 0.4rem;
	}
	.battery-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.45rem 0.65rem;
		border-radius: 999px;
		background: rgba(255,255,255,0.06);
		border: 1px solid rgba(255,255,255,0.16);
		color: #d7d7d7;
		font-size: 0.78rem;
	}
	.intro-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 5;
		background: radial-gradient(circle, rgba(5,5,5,0.4) 0%, rgba(0,0,0,0.7) 100%);
		animation: fadeIn 0.6s ease;
	}
	.intro-card {
		max-width: 32rem;
		padding: 1.2rem 1.3rem;
		border-radius: 1.1rem;
		background: rgba(9,9,9,0.82);
		border: 1px solid rgba(255,255,255,0.14);
		box-shadow: 0 18px 40px rgba(0,0,0,0.3);
		backdrop-filter: blur(18px);
		animation: popIn 0.8s ease;
	}
	.intro-badge {
		display: inline-flex;
		padding: 0.28rem 0.6rem;
		border-radius: 999px;
		margin-bottom: 0.7rem;
		font-size: 0.7rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #b9b9b9;
		background: rgba(255,255,255,0.08);
	}
	.intro-card h1 {
		margin: 0 0 0.35rem;
		font-size: 1.4rem;
		letter-spacing: 0.02em;
	}
	.intro-card p {
		margin: 0;
		color: #b8b8b8;
		line-height: 1.5;
	}
	@keyframes pulseGlow {
		0%,
		100% { transform: translateX(-50%) scale(1); opacity: 0.9; }
		50% { transform: translateX(-50%) scale(1.08); opacity: 1; }
	}
	@keyframes driftWave {
		0% { transform: translateX(-5%) rotate(-5deg); }
		50% { transform: translateX(5%) rotate(4deg); }
		100% { transform: translateX(-5%) rotate(-5deg); }
	}
	@keyframes floatParticle {
		0%,
		100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.4; }
		50% { transform: translate3d(12px, -18px, 0) scale(1.2); opacity: 0.95; }
	}
	@keyframes floatButton {
		0%,
		100% { transform: translateY(0); }
		50% { transform: translateY(-2px); }
	}
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	@keyframes popIn {
		from { opacity: 0; transform: translateY(10px) scale(0.97); }
		to { opacity: 1; transform: translateY(0) scale(1); }
	}
`;
export default App;
