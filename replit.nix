{pkgs}: {
  deps = [
    pkgs.curl
    pkgs.jq
    pkgs.libxcrypt
    pkgs.ffmpeg
    pkgs.postgresql
  ];
}
