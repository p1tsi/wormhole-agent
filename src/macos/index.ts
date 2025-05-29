import * as checksec from './checksec';
import * as certpinning from './pinning';
import * as dump from './dump';
import * as dumpipa from './dump_ipa';
//import * as hooking from './hooking/hooking';
import * as info from './info'
import * as classdump from './classdump'
import * as symbol from './symbol'
import * as heap from './heap'
import * as disasm from './disasm'
import * as keychain from './keychain'
import * as fs from './fs'
//import * as stalker from './stalker'
import * as swiftdump from './swiftdump'
import * as fileDescriptors from './fileDescriptors'
import * as url from './url'
//import * as ui from './ui'

export default {
    checksec,
    info,
    certpinning,
    dumpipa,
    dump,
    classdump,
    symbol,
    heap,
    disasm,
    keychain,
    fs,
    swiftdump,
    fileDescriptors,
    url
    //ui
}