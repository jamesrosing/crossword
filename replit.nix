{ pkgs }: {
  deps = [
    pkgs.mullvad
    pkgs.run
    pkgs.imagemagick_light
    pkgs.python312Packages.prisma
    pkgs.apk-tools
    pkgs.rsync
    pkgs.postgresql
    pkgs.vercel-pkg
    pkgs.cowsay
    pkgs.chromium
    pkgs.glib
    pkgs.gtk3
    pkgs.nss
    pkgs.freetype
    pkgs.fontconfig
    pkgs.cups
    pkgs.xorg.libX11
    pkgs.xorg.libXcomposite
    pkgs.xorg.libXcursor
    pkgs.xorg.libXdamage
    pkgs.xorg.libXext
    pkgs.xorg.libXi
    pkgs.xorg.libXrandr
    pkgs.xorg.libXrender
    pkgs.xorg.libXtst
    pkgs.gconf
    pkgs.openssl_3
    pkgs.pkg-config
    pkgs.libuuid
    pkgs.nodejs-18_x
  ];
  env = {
    LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
      pkgs.openssl_3
      pkgs.libuuid
      "${pkgs.lib.getLib pkgs.stdenv.cc}/lib"
    ];
    DATABASE_URL = "postgresql://neondb_owner:qSwHUMfN5v6T@ep-wandering-salad-a5lkfys6.us-east-2.aws.neon.tech/neondb?sslmode=require";
    DIRECT_URL = "postgresql://neondb_owner:qSwHUMfN5v6T@ep-wandering-salad-a5lkfys6.us-east-2.aws.neon.tech:5432/neondb";
    PRISMA_CLIENT_ENGINE_TYPE = "binary";
    PRISMA_CLI_QUERY_ENGINE_TYPE = "binary";
  };
}