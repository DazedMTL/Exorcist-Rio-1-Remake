//=============================================================================
// StateIconInMap.js
//=============================================================================

/*:ja
 * @plugindesc マップ時にステートアイコンを表示
 * @author tubo
 *
 * @param map iconIndex
 * @desc マップに表示するアイコン番号（"4":12 ステート[4]の表示をアイコン[12]に変更）
 * @default "4":18, "5":19
 *
 * @param hide stateId
 * @desc 頭上に表示させないステート番号
 * @default 1,2,3
 *
 * @param show number
 * @desc 表示数（-1:全て表示 0:表示しない 1:優先度が最大のみ 2~:指定数を優先度順に交互表示）
 * @default 1
 *
 * @param offset
 * @desc 座標の調整 x,y
 * @default 0,0
 *
 * @param is hiding in event
 * @desc イベント時に隠すかどうか
 * @default true
 *
 * @help
 * ステートのメモ欄に
 * <mapIcon: n>と表記するとn番のアイコンを表示します
 * <mapIcon: 0>で非表示になります
 * 指定がない場合はそのままアイコンを表示します
 *
 */

(function () {
  var parameters = PluginManager.parameters("StateIconInMap");
  var SIM = {};
  SIM.replaceIcon = JSON.parse("{" + parameters["map iconIndex"] + "}");
  SIM.hide = JSON.parse("[" + parameters["hide stateId"] + "]");
  SIM.offset = JSON.parse("[" + parameters["offset"] + "]");
  SIM.showNumber = JSON.parse(parameters["show number"]);
  SIM.eventHide = JSON.parse(parameters["is hiding in event"]);

  // Sprite_Character
  var _Sprite_Character_setCharacter_sim =
    Sprite_Character.prototype.setCharacter;
  Sprite_Character.prototype.setCharacter = function (character) {
    _Sprite_Character_setCharacter_sim.call(this, character);
    if (!this._mapStateSprite) {
      var sprite = new Sprite_MapStateIcon();
      this._mapStateSprite = sprite;
      this.addChild(sprite);
    }
    if (character.constructor == Game_Player) {
      this._mapStateSprite.setup($gameParty.leader());
    } else if (character.actor) {
      this._mapStateSprite.setup(character.actor());
      //		} else if (character.constructor == Game_Event && character.enemy) {
      //			this._mapStateSprite.setup(character.enemy());
    }
  };

  // Sprite_MapStateIcon
  function Sprite_MapStateIcon() {
    this.initialize.apply(this, arguments);
  }
  Sprite_MapStateIcon.prototype = Object.create(Sprite_StateIcon.prototype);
  Sprite_MapStateIcon.prototype.constructor = Sprite_MapStateIcon;

  Sprite_MapStateIcon.prototype.updateIcon = function () {
    if ($gameMap.isEventRunning() && SIM.eventHide) {
      this._animationIndex = 0;
      this._iconIndex = 0;
      return;
    }
    if (this._battler && SIM.showNumber != 0) {
      if (!$gamePlayer.followers().isVisible() && this._battler.index() !== 0) {
        this._animationIndex = 0;
        this._iconIndex = 0;
        return;
      }
      var states = this._battler.states();
      states = states.filter(function (state) {
        return (
          state.meta.mapIcon !== "0" &&
          SIM.replaceIcon[state.id] !== 0 &&
          SIM.hide.indexOf(state.id) === -1
        );
      });
      if (states.length > 0) {
        this.x = SIM.offset[0];
        this.y = -this.parent.height - 16 + SIM.offset[1];

        if (SIM.showNumber === -1) {
        } else if (SIM.showNumber === 1) {
          states = [
            states.reduce(function (a, b) {
              return a.priority > b.priority ? a : b;
            }),
          ];
        } else {
          states.sort(function (a, b) {
            return a.priority > b.priority;
          });
          if (states.length > SIM.showNumber) {
            states.splice(SIM.showNumber);
          }
        }
        var icons = states.map(function (state) {
          if (state.meta.mapIcon) return Number(state.meta.mapIcon);
          if (SIM.replaceIcon[state.id]) return SIM.replaceIcon[state.id];
          return state.iconIndex;
        });

        if (icons.length > 0) {
          this._animationIndex++;
          if (this._animationIndex >= icons.length) {
            this._animationIndex = 0;
          }
          this._iconIndex = icons[this._animationIndex];
        } else {
          this._animationIndex = 0;
          this._iconIndex = 0;
        }
      } else {
        this._animationIndex = 0;
        this._iconIndex = 0;
      }
    }
  };
})();
