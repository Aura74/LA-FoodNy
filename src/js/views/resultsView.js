import View from "./View.js";
import previewView from "./previewView.js";
import icons from "url:../../img/icons.svg"; // Parcel2

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = "Inga recept stavas så";
  _message = "";

  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new ResultsView();
