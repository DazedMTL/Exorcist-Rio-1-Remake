//=============================================================================
// AltMenuScreen_ky.js
//=============================================================================

/*:
 * @plugindesc Alternative menu screen layout.
 * @author Yoji Ojima
 *
 * @param maxColsMenu
 * @desc アクターを表示するウィンドウの1画面の登録最大数です。
 * @default 4
 *
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc メニュー画面のレイアウトを変更します。
 * @author Yoji Ojima
 *
 * @param maxColsMenu
 * @desc １画面に表示するアクター数。（5人以上は未対応）
 * @default 4
 *
 * @help このプラグインには、プラグインコマンドはありません。
 *
 *  - アクターに立ち絵を利用します。
 *　　　　　　（この機能は、AltMenuScreen2.jsからの抜粋です）
 *
 * アクターのメモに以下のように書いてください:
 * <stand_picture:ファイル名> ファイル名が、そのアクターの立ち絵になります。
 *  ファイルは img/pictures に置いてください。
 *　記入例）
 *　<stand_picture:Package1>
 */

(function () {
  // set parameters
  var parameters = PluginManager.parameters("AltMenuScreen_ky");
  var maxColsMenuWnd = Number(parameters["maxColsMenu"] || 4);

  var _Scene_Menu_create = Scene_Menu.prototype.create;
  Scene_Menu.prototype.create = function () {
    _Scene_Menu_create.call(this);
    this._statusWindow.x = this._commandWindow.width;
    this._statusWindow.y = 0;
    //        this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
  };

  Window_MenuStatus.prototype.maxCols = function () {
    return maxColsMenuWnd; //１ページのアクター数
  };

  Window_MenuStatus.prototype.numVisibleRows = function () {
    return 1;
  };

  Window_MenuStatus.prototype.drawItemImage = function (index) {
    var actor = $gameParty.members()[index];
    var rect = this.itemRectForText(index);
    // load stand_picture
    var bitmapName = $dataActors[actor.actorId()].meta.stand_picture;
    var bitmap = bitmapName ? ImageManager.loadPicture(bitmapName) : null;
    var w = Math.min(rect.width, bitmapName ? bitmap.width : 144);
    var h = Math.min(rect.height, bitmapName ? bitmap.height : 144);
    var lineHeight = this.lineHeight();
    this.changePaintOpacity(actor.isBattleMember());
    if (bitmap) {
      var sx = bitmap.width > w ? (bitmap.width - w) / 2 : 0;
      var sy = bitmap.height > h ? (bitmap.height - h) / 2 : 0;
      var dx =
        bitmap.width > rect.width
          ? rect.x
          : rect.x + (rect.width - bitmap.width) / 2;
      var dy =
        bitmap.height > rect.height
          ? rect.y
          : rect.y + (rect.height - bitmap.height) / 2;
      this.contents.blt(bitmap, sx, sy, w, h, dx, dy);
    } else {
      // when bitmap is not set, do the original process.
      this.drawActorFace(actor, rect.x, rect.y + lineHeight * 2.5, w, h);
    }
    this.changePaintOpacity(true);
  };

  Window_MenuStatus.prototype.drawItemStatus = function (index) {
    var actor = $gameParty.members()[index];
    var rect = this.itemRectForText(index);
    var x = rect.x;
    var y = rect.y;
    var width = rect.width;
    var bottom = y + rect.height;
    var lineHeight = this.lineHeight();
    this.drawActorName(actor, x, y + lineHeight * 0, width);
    this.drawActorLevel(actor, x, y + lineHeight * 1, width);
    this.drawActorClass(actor, x, bottom - lineHeight * 4, width);
    this.drawActorHp(actor, x, bottom - lineHeight * 3, width);
    this.drawActorMp(actor, x, bottom - lineHeight * 2, width);
    this.drawActorIcons(actor, x, bottom - lineHeight * 1, width);
  };
})();
