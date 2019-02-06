import * as path from 'path';
import config from '../../core/config.helper';

class FileHandler implements HandlerInterface {
  public isSatisfiedBy(element) {
    return element.getTagName().then(tagName => {
      if (tagName === 'input') {
        return element.getAttribute('type').then(inputType => inputType === 'file');
      }

      if (tagName instanceof Array) {
        return element
          .first()
          .getAttribute('type')
          .then(inputType => inputType === 'file');
      }

      return false;
    });
  }

  public handleFill(page, elementName, desiredValue) {
    const fileToUpload = path.resolve(path.join(config.projectPath, config.data, desiredValue));

    return page[elementName].sendKeys(fileToUpload);
  }

  public handleCheck(page, elementName, desiredValue) {
    return page[elementName].getText().then(text => {
      if (text === desiredValue) {
        return Promise.resolve();
      }

      return Promise.reject(`Expected ${desiredValue} got ${text} for file element ${elementName}`);
    });
  }

  public getPriority() {
    return 998;
  }
}

export const fileHandler = new FileHandler();
