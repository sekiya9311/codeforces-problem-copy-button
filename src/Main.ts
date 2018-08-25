
export class Main {
  private readonly ProblemStatementId : string = 'problem-statement';
  private readonly NewLine: string = '\n';

  public constructor() {
    const problemStates = document.getElementsByClassName(this.ProblemStatementId);
    let convertProblem = new Array<string>();
    if (problemStates !== null && problemStates.length > 0) {
      try {
        const problemState = problemStates[0];

        // head
        const headerElement = problemState.children[0] as HTMLElement;
        {
          let convert = headerElement.innerText;
          convertProblem.push(convert.replace('time limit per test', 'time limit per test: ')
            .replace('memory limit per test', 'memory limit per test: ')
            .replace('inputstandard input', 'input: standard input')
            .replace('outputstandard output', 'output: standard output'));
        }

        // body
        const bodyElement = problemState.children[1] as HTMLElement;
        convertProblem.push(this.analyzeElement(bodyElement));

        // input format
        const inputElement = problemState.children[2] as HTMLElement;
        convertProblem.push(this.analyzeElement(inputElement));

        // output format
        const outputElement = problemState.children[3] as HTMLElement;
        convertProblem.push(this.analyzeElement(outputElement));

        // sample (do nothing)
        const sampleElement = problemState.children[4] as HTMLElement;

        // note
        const noteElement = problemState.children[5] as HTMLElement;
        convertProblem.push(this.analyzeElement(noteElement));

        if (this.setCopyButton(convertProblem.join(this.NewLine))) {
          this.putLog('Set button success!');
        } else {
          throw new Error('Set button failed...');
        }
      } catch (err) {
        this.putLog('Set button failed...', err);
      }
    } else {
      this.putLog('Not problem page.');
    }
  }

  private analyzeElement(element: HTMLElement): string {
    let result = new Array<string>();
    element.childNodes.forEach((childNode) => {
      switch (childNode.nodeName.toLowerCase()) {
        case '#text': {
          result.push(childNode.nodeValue);
          break;
        }
        case 'span': {
          let foo = this.analyzeElement(childNode as HTMLElement);
          if (foo.length) {
            result.push(foo);
          }
          break;
        }
        case 'div': {
          let foo = this.analyzeElement(childNode as HTMLElement);
          if (foo.length) {
            result.push(this.NewLine + foo + this.NewLine);
          }
          break;
        }
        case 'script': {
          let foo = this.analyzeElement(childNode as HTMLElement);
          if (foo.length) {
            result.push(foo);
          }
          break;
        }
        case 'p': {
          let foo = this.analyzeElement(childNode as HTMLElement);
          if (foo.length) {
            result.push(this.NewLine + foo + this.NewLine);
          }
          break;
        }
        case 'pre': { break; }
        case 'br': { break; }
        case 'msup': { break; }
        case 'msub': { break; }
        case 'math': { break; }
        case 'mn': { break; }
        case 'mi': { break; }
        case 'mo': { break; }
      }
    });
    return result.join('');
  }

  private setCopyButton(copyTarget: string): boolean {
    try {
      const CopyButtonClassName = 'input-output-copier';
      let copyButton = document.createElement('div');
      copyButton.innerText = 'copy problem';
      copyButton.className = CopyButtonClassName;
      copyButton.addEventListener('click', () => this.textCopyToClipBoard(copyTarget));
      const ProblemStatementElement = document.getElementsByClassName(this.ProblemStatementId)[0];
      ProblemStatementElement.insertBefore(copyButton, ProblemStatementElement.children[4]);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  private textCopyToClipBoard(copyTarget: string): boolean {
    try {
      window.getSelection().removeAllRanges();
      const textAreaForCopy = document.createElement('textarea');
      textAreaForCopy.textContent = copyTarget;
      document.body.appendChild(textAreaForCopy);
      textAreaForCopy.select();
      const successed = document.execCommand('copy');
      document.body.removeChild(textAreaForCopy);
      if (successed) {
        this.putLog('Copy success!');
      } else {
        this.putLog('Copy failed...');
      }
      return successed;
    } catch (err) {
      this.putLog('Copy failed...', err);
    }
  }

  private putLog(msg: string, err: any = null) {
    const LogHeader = '[codeforces-problem-copy-button]: ';
    console.log(LogHeader + msg);
    if (err) {
      console.error(err);
    }
  }
}