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
          default = pkgs.mkShell {
            buildInputs = with pkgs; [
              nodejs_22
              pnpm
              git
            ];

            shellHook = ''
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
