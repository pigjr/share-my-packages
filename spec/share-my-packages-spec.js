'use babel';

import ShareMyPackages from '../lib/share-my-packages';

// Use the command `window:run-package-specs` (ctrl-shift-y) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('ShareMyPackages', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('share-my-packages');
  });

  describe('when the share-my-packages:plain event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.share-my-packages')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'share-my-packages:plain');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.share-my-packages')).toExist();

        let shareMyPackagesElement = workspaceElement.querySelector('.share-my-packages');
        expect(shareMyPackagesElement).toExist();

        let shareMyPackagesPanel = atom.workspace.panelForItem(shareMyPackagesElement);
        expect(shareMyPackagesPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'share-my-packages:toggle');
        expect(shareMyPackagesPanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.share-my-packages')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'share-my-packages:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let shareMyPackagesElement = workspaceElement.querySelector('.share-my-packages');
        expect(shareMyPackagesElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'share-my-packages:toggle');
        expect(shareMyPackagesElement).not.toBeVisible();
      });
    });
  });
});
