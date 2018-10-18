
export class Main {
  private readonly ProblemStatementClassName: string = 'problem-statement';
  private readonly SampleTestsClassName: string = 'sample-tests';
  private readonly NewLine: string = '\n';

  public constructor() {
    if (this.setCopyButton()) {
      this.putLog('Set button success!');
    } else {
      throw new Error('Set button failed...');
    }
  }

private getProblem(): string {
  const problemStates = document.getElementsByClassName(this.ProblemStatementClassName);
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

      for (let i = 1; i < problemState.children.length; i++) {
        if (problemState.children[i].className != this.SampleTestsClassName) {
          // exclude sample-tests
          const element = problemState.children[i] as HTMLElement;
          convertProblem.push(this.analyzeElement(element));
        }
      }

      return convertProblem.join(this.NewLine).split('$$$').join('');
      
    } catch (err) {
      throw err;
    }
  } else {
    throw new Error('Not problem page.');
  }
}

  private analyzeElement(element: HTMLElement): string {
    let result = new Array<string>();
    const IsParentOrderedList = element.nodeName.toLowerCase() === 'ol';
    let prefNum = 0;
    element.childNodes.forEach(childNode => {
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
        case 'p': {
          let foo = this.analyzeElement(childNode as HTMLElement);
          if (foo.length) {
            result.push(this.NewLine + foo + this.NewLine);
          }
          break;
        }
        case 'ul': {
          let foo = this.analyzeElement(childNode as HTMLElement);
          if (foo.length) {
            result.push(this.NewLine + foo + this.NewLine);
          }
          break;
        }
        case 'li': {
          let foo = this.analyzeElement(childNode as HTMLElement);
          if (foo.length) {
            if (IsParentOrderedList) {
              foo = (++prefNum).toString() + '. ' + foo;
            }
            result.push(this.NewLine + '・' + foo + this.NewLine);
          }
          break;
        }
        case 'pre': { break; }
        case 'br': { break; }
        case 'script': { break; }
        case 'msup': {
          let foo = this.analyzeElement(childNode as HTMLElement);
          if (foo.length) {
            result.push(foo);
          }
          break;
        }
        case 'msub': {
          let foo = this.analyzeElement(childNode as HTMLElement);
          if (foo.length) {
            result.push(foo);
          }
          break;
        }
        case 'math': {
          let foo = this.analyzeElement(childNode as HTMLElement);
          if (foo.length) {
            result.push(foo);
          }
          break;
        }
        case 'mn': { break; }
        case 'mi': { break; }
        case 'mo': { break; }
        case 'ol': {
          let foo = this.analyzeElement(childNode as HTMLElement);
          if (foo.length) {
            result.push(foo);
          }
          break;
        }
        case 'i': {
          let foo = this.analyzeElement(childNode as HTMLElement);
          if (foo.length) {
            result.push(foo);
          }
        }
      }
    });
    return result.join('');
  }

  private setCopyButton(): boolean {
    try {
      const CopyButtonClassName = 'input-output-copier';
      let copyButton = document.createElement('div');
      copyButton.innerText = 'copy problem';
      copyButton.className = CopyButtonClassName;
      copyButton.addEventListener('click', () => this.textCopyToClipBoard(this.getProblem()));
      const ProblemStatementElement = document.getElementsByClassName(this.ProblemStatementClassName)[0];
      ProblemStatementElement.parentNode.insertBefore(copyButton, ProblemStatementElement);
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