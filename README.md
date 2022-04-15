``` php
<?php

$ServerAddress = "162.14.125.94";
$ServerPort = "25565";

$Data = "\x00"; // packet ID = 0 (varint)

$Data .= "\x04"; // Protocol version (varint)
$Data .= \pack( 'c', \strlen( $ServerAddress ) ) . $ServerAddress; // Server (varint len + UTF-8 addr)
$Data .= \pack( 'n', $ServerPort ); // Server port (unsigned short)
$Data .= "\x01"; // Next state: status (varint)

$Data = \pack( 'c', \strlen( $Data ) ) . $Data; // prepend length of packet ID + data

$Data = $Data . "\x01\x00";

echo "13 00 04 0d 31 36 32 2e 31 34 2e 31 32 35 2e 39 34 63 dd 01 01 00 ";
echo bin2hex($Data);
```