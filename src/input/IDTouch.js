/**
 * IDTouch.js
 *
 * @module InputDetect
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */

import IDMouse from "./IDMouse.js";
import IDPosition from "./IDPosition.js";

/**
 * タッチデバイス入力を管理するクラスです。
 * 最大3本指のマルチタッチ操作を検出し、それぞれをマウスの左・右・中央クリックに割り当てて管理できます。
 * タッチイベントをPCのマウスイベントとして扱う変換処理も含まれています。
 */
export default class IDTouch extends IDMouse {
	/**
	 * 指3本までのタッチ操作に対応した入力管理クラス
	 * 1本目は左クリック、2本目は右クリック、3本目は中央クリックとして扱います。
	 * @constructor
	 */
	constructor() {
		super();
		this._initIDTouch();
	}

	/**
	 * 内部の初期化処理を行います。
	 * @private
	 */
	_initIDTouch() {
		/**
		 * タッチ数とマウスボタン番号のマッピング
		 * @type {Object<number, number>}
		 * @private
		 */
		this.touchcount_to_mask = {
			1: IDMouse.MOUSE_EVENTS.BUTTON1_MASK,
			2: IDMouse.MOUSE_EVENTS.BUTTON3_MASK,
			3: IDMouse.MOUSE_EVENTS.BUTTON2_MASK
		};
		const that = this;
		/**
		 * @param {MouseEvent} e
		 * @private
		 */
		this._mousePressed = function (e) {
			that.mousePressed(e);
		};
		/**
		 * @param {MouseEvent} e
		 * @private
		 */
		this._mouseReleased = function (e) {
			that.mouseReleased(e);
		};
		/**
		 * @param {MouseEvent} e
		 * @private
		 */
		this._mouseMoved = function (e) {
			that.mouseMoved(e);
		};
		/**
		 * 2本指の操作中かどうか
		 * @type {boolean}
		 */
		this.isdoubletouch = false;

		/**
		 * @type {IDPosition}
		 * @private
		 */
		this._doubleposition_p1 = null;

		/**
		 * @type {IDPosition}
		 * @private
		 */
		this._doubleposition_p2 = null;
	}

	/**
	 * タッチ開始時、すべての座標情報を初期化します。
	 * @param {MouseEvent|TouchEvent} mouseevent - マウスイベント相当のオブジェクト
	 * @private
	 */
	_initPosition(mouseevent) {
		this.left.setPosition(mouseevent);
		this.right.setPosition(mouseevent);
		this.center.setPosition(mouseevent);
	}

	/**
	 * マウスイベントのプロパティを仮想的なマウスイベント
	 * @typedef {Object} VirtualMouseEvent
	 * @property {number} clientX マウスのX座標
	 * @property {number} clientY マウスのY座標
	 * @property {number} button マウスボタンの種類
	 * @property {EventTarget} target イベントのターゲット
	 * @property {number} touchcount タッチ数
	 */

	/**
	 * タッチイベントを仮想的なマウスイベントへ変換します。
	 * 指の平均座標を計算し、タッチ数から対応するボタンを設定します。
	 * @param {TouchEvent} touchevent - タッチイベント
	 * @returns {MouseEvent} 仮想マウスイベントオブジェクト
	 * @private
	 */
	_MultiTouchToMouse(touchevent) {
		let x = 0,
			y = 0;
		// 座標はすべて平均値の位置とします。
		// identifier を使用すれば、1本目、2本目と管理できますが、実装は未対応となっています。
		for (let i = 0; i < touchevent.touches.length; i++) {
			x += touchevent.touches[i].clientX;
			y += touchevent.touches[i].clientY;
		}
		/**
		 * @type {VirtualMouseEvent}
		 */
		const event = {};
		if (touchevent.touches.length > 0) {
			event.clientX = x / touchevent.touches.length;
			event.clientY = y / touchevent.touches.length;
			event.button = this.touchcount_to_mask[touchevent.touches.length];
			const touch = touchevent.touches[0];
			event.target = touch.target ? touch.target : touchevent.currentTarget;
		} else {
			event.clientX = 0;
			event.clientY = 0;
			event.button = 0;
		}
		event.touchcount = touchevent.touches.length;
		// @ts-ignore
		return /** @type {MouseEvent} */ event;
	}

	/**
	 * 2本指タッチによるピンチ操作を検出し、ホイール回転に変換します。
	 * @param {TouchEvent} touchevent - タッチイベント
	 * @private
	 */
	_MoveMultiTouch(touchevent) {
		if (touchevent.touches.length === 2) {
			const p1 = touchevent.touches[0];
			const p2 = touchevent.touches[1];
			if (this.isdoubletouch === false) {
				this.isdoubletouch = true;
				this._doubleposition_p1 = new IDPosition(p1.clientX, p1.clientY);
				this._doubleposition_p2 = new IDPosition(p2.clientX, p2.clientY);
			} else {
				// 前回との2点間の距離の増加幅を調べる
				// これによりピンチイン／ピンチアウト操作がわかる。
				const newp1 = new IDPosition(p1.clientX, p1.clientY);
				const newp2 = new IDPosition(p2.clientX, p2.clientY);
				const x =
					IDPosition.norm(this._doubleposition_p1, this._doubleposition_p2) - IDPosition.norm(newp1, newp2);
				this._doubleposition_p1 = newp1;
				this._doubleposition_p2 = newp2;
				// そんなにずれていなかったら無視する
				const r = Math.abs(x) < 10 ? Math.abs(x) * 0.01 : 0.5;
				this.wheelrotation += (x > 0 ? -1 : 1) * r;
			}
		} else {
			this.isdoubletouch === false;
		}
	}

	/**
	 * 指定されたボタンに応じて関数を呼び分けます。
	 * @param {MouseEvent} mouseevent - 仮想マウスイベント
	 * @param {Function} funcOn - 対象ボタンで呼ぶ関数
	 * @param {Function} funcOff - それ以外のボタンで呼ぶ関数
	 * @param {number} target - 対象となるボタン番号
	 * @private
	 */
	_actFuncMask(mouseevent, funcOn, funcOff, target) {
		const events = /** @type {VirtualMouseEvent} */ mouseevent;
		for (const key in IDMouse.MOUSE_EVENTS) {
			// @ts-ignore
			events.button = IDMouse.MOUSE_EVENTS[key];
			// @ts-ignore
			if (IDMouse.MOUSE_EVENTS[key] === target) {
				funcOn(events);
			} else {
				funcOff(events);
			}
		}
	}

	/**
	 * タッチ開始イベントを処理します。
	 * @param {TouchEvent} touchevent - タッチイベント
	 * @private
	 */
	_touchStart(touchevent) {
		const mouseevent = this._MultiTouchToMouse(touchevent);
		// タッチした時点ですべての座標を初期化する
		this._initPosition(mouseevent);
		this._actFuncMask(mouseevent, this._mousePressed, this._mouseReleased, mouseevent.button);
	}

	/**
	 * タッチ終了イベントを処理します。
	 * @param {TouchEvent} touchevent - タッチイベント
	 * @private
	 */
	_touchEnd(touchevent) {
		const mouseevent = this._MultiTouchToMouse(touchevent);
		this._actFuncMask(mouseevent, this._mouseReleased, this._mouseReleased, mouseevent.button);
	}

	/**
	 * タッチ移動イベントを処理します。
	 * @param {TouchEvent} touchevent - タッチイベント
	 * @private
	 */
	_touchMove(touchevent) {
		this._MoveMultiTouch(touchevent);
		const mouseevent = this._MultiTouchToMouse(touchevent);
		this._actFuncMask(mouseevent, this._mouseMoved, this._mouseMoved, mouseevent.button);
	}

	/**
	 * 対象要素にタッチイベントリスナーを設定します。
	 * @param {HTMLElement} element - イベントを監視するDOM要素
	 */
	setListenerOnElement(element) {
		super.setListenerOnElement(element);

		const that = this;

		/**
		 * @param {TouchEvent} touchevent
		 */
		const touchStart = function (touchevent) {
			that._touchStart(touchevent);
		};

		/**
		 * @param {TouchEvent} touchevent
		 */
		const touchEnd = function (touchevent) {
			that._touchEnd(touchevent);
		};

		/**
		 * @param {TouchEvent} touchevent
		 */
		const touchMove = function (touchevent) {
			that._touchMove(touchevent);
			// スクロール禁止
			touchevent.preventDefault();
		};

		element.addEventListener("touchstart", touchStart, false);
		element.addEventListener("touchend", touchEnd, false);
		element.addEventListener("touchmove", touchMove, false);
		element.addEventListener("touchcancel", touchEnd, false);
	}
}
