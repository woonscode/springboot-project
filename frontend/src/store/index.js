import { atomWithStorage, createJSONStorage } from 'jotai/utils'
let sessionAtom=atomWithStorage('session', {jwt: '', role: '', email: ''});
if (typeof window !== 'undefined') {
const storage = createJSONStorage(() => sessionStorage)
sessionAtom = atomWithStorage('data', {}, storage)
}
export {sessionAtom}