export interface VersionOptions {
    major: boolean;
    minor: boolean;
    patch: boolean;
    prerelease: boolean;
}

export interface VersionCommandOptions extends VersionOptions {
    check: boolean;
    push: boolean;
}
