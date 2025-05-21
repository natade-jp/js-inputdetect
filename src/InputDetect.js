/**
 * InputDetect
 *
 * @module InputDetect
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */

import IDTouch from "./input/IDTouch.js";
import IDTools from "./input/IDTools.js";

export default class InputDetect {
	/**
	 * @private
	 */
	constructor() {
		/**
		 * @type {IDTouch}
		 * @private
		 */
		this._data = new IDTouch();
	}

	/**
	 * InputDetect のインスタンスを生成します。
	 * @returns {InputDetect}
	 */
	static create() {
		return new InputDetect();
	}

	/**
	 * 対象要素にタッチイベントリスナーを設定します。
	 * @param {HTMLElement} element - イベントを監視するDOM要素
	 */
	setListenerOnElement(element) {
		this._data.setListenerOnElement(element);
	}

	/**
	 * 現在の入力情報が入ったIDTouchインスタンスを取得します。
	 * 各ボタンや位置、ホイール回転量が渡され、渡した後はホイール量がリセットされます。
	 * @returns {IDTouch} - タッチデータを持つIDTouchインスタンス
	 */
	pickInput() {
		const pick_data = new IDTouch();
		this._data.pickInput(pick_data);
		return pick_data;
	}

	/**
	 * スクロールを禁止します。
	 *
	 * @function
	 * @returns {void}
	 *
	 * @example
	 * // ページの縦スクロールを禁止したいときに実行
	 * IDTools.noScroll();
	 */
	static noScroll() {
		IDTools.noScroll();
	}
}
