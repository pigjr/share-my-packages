'use babel';

import ShareMyPackagesView from './share-my-packages-view';
import {
    CompositeDisposable
} from 'atom';

export default {

    shareMyPackagesView: null,
    modalPanel: null,
    subscriptions: null,

    activate(state) {
        this.shareMyPackagesView = new ShareMyPackagesView(state.shareMyPackagesViewState);
        this.modalPanel = atom.workspace.addModalPanel({
            item: this.shareMyPackagesView.getElement(),
            visible: false
        });

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'share-my-packages:plain': () => this.plain()
        }));
    },

    deactivate() {
        this.modalPanel.destroy();
        this.subscriptions.dispose();
        this.shareMyPackagesView.destroy();
    },

    serialize() {
        return {
            shareMyPackagesViewState: this.shareMyPackagesView.serialize()
        };
    },

    plain() {

        let prefix = "I've installed these awesome Atom community packages: \n\n";
        let postfix = '\n\nGenerated by "share-my-packages"';
        let pkgs = atom.packages.getLoadedPackages().filter(function(pkg) {
            return !pkg.bundledPackage;
        });
        let commaConcatenatedPackageList = '';
        for (var i = 0; i < pkgs.length; i++) {
            commaConcatenatedPackageList += pkgs[i].name + ', ';
        }
        commaConcatenatedPackageList = prefix + commaConcatenatedPackageList.slice(0, -2) + postfix;

        atom.clipboard.write(commaConcatenatedPackageList);
        atom.notifications.addSuccess("List is copied to clipboard!");

    }

};