{
  description = "TomSegbers.de personal website dev shell";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      supportedSystems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forEachSystem = nixpkgs.lib.genAttrs supportedSystems;
    in
    {
      devShells = forEachSystem (system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        {
          default =
            let
              chromeRuntimeLibs = with pkgs; [
                alsa-lib
                at-spi2-atk
                at-spi2-core
                cairo
                cups
                dbus
                expat
                fontconfig
                freetype
                glib
                gtk3
                libdrm
                libgbm
                libGL
                libx11
                libxcb
                libxcomposite
                libxdamage
                libxext
                libxfixes
                libxkbcommon
                libxrandr
                mesa
                nspr
                nss
                pango
                udev
              ];
            in
            pkgs.mkShell {
              buildInputs = with pkgs; [
                nodejs_22
                pnpm
                git
              ] ++ chromeRuntimeLibs;

              shellHook = ''
                export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath chromeRuntimeLibs}''${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}
                echo " TomSegbers.de dev shell"
                echo "  node:  $(node --version)"
                echo "  pnpm:  $(pnpm --version)"
                echo "  git:   $(git --version 2>/dev/null | cut -d' ' -f3)"
              '';
            };
        }
      );
    };
}
