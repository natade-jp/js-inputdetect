/**
 * IDTools.js
 *
 * @module InputDetect
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */

/**
 * デバイス系ツールユーティリティのオブジェクトです。
 * 主に画面スクロールの制御など、補助的な機能を提供します。
 */
const IDTools = {
	/**
	 * ページの縦スクロールバーを非表示にします。
	 * HTMLのbodyとhtml要素のスタイルを変更し、ページ全体でスクロールを禁止します。
	 *
	 * @function
	 * @returns {void}
	 *
	 * @example
	 * // ページの縦スクロールを禁止したいときに実行
	 * IDTools.noScroll();
	 */
	noScroll: function () {
		// 縦のスクロールバーを削除
		const main = function () {
			// body
			document.body.style.height = "100%";
			document.body.style.overflow = "hidden";
			// html
			document.documentElement.style.height = "100%";
			document.documentElement.style.overflow = "hidden";
		};
		window.addEventListener("load", main, false);
	}
};

export default IDTools;
