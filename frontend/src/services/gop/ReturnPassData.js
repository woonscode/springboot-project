const ReturnPassData = () => {

    function createData(email, returnDate, passId, destination) {
        return { email, returnDate, passId, destination }
    }
    
    // for this part, should get data directly from DB
    const rows = [
        createData('justin.cheu.2020@scis.smu.edu.sg', '21 Oct 2022', 123123, 'Zoo'),
        createData('ng.shenjie.2020@scis.smu.edu.sg', '21 Oct 2022', 123123, 'Zoo'),
        createData('trisha.tan.2020@scis.smu.edu.sg', '21 Oct 2022', 123123, 'Zoo'),
        createData('greg.2020@scis.smu.edu.sg', '21 Oct 2022', 123123, 'Zoo'),
        createData('woon.hao.2020@scis.smu.edu.sg', '21 Oct 2022', 123123, 'Zoo'),
        createData('amelia.tay.2020@scis.smu.edu.sg', '21 Oct 2022', 123123, 'Zoo'),
        createData('amelia.tay.2020@economics.smu.edu.sg', '21 Oct 2022', 123123, 'Zoo'),
        createData('amelia.tay.2020@business.smu.edu.sg', '21 Oct 2022', 123123, 'Zoo'),
        createData('greg.2020@scis.smu.edu.sg', '21 Oct 2022', 123123, 'Zoo'),
        createData('woon.hao.2020@scis.smu.edu.sg', '21 Oct 2022', 123123, 'Zoo'),
        createData('amelia.tay.2020@scis.smu.edu.sg', '21 Oct 2022', 123123, 'Zoo'),
        createData('amelia.tay.2020@economics.smu.edu.sg', '21 Oct 2022', 123123, 'Zoo'),
        createData('amelia.tay.2020@business.smu.edu.sg', '21 Oct 2022', 123123, 'Zoo'),
        createData('woon.hao.2020@scis.smu.edu.sg', '21 Oct 2022', 123123, 'Zoo'),
        createData('amelia.tay.2020@scis.smu.edu.sg', '21 Oct 2022', 123123, 'Zoo'),
        createData('amelia.tay.2020@economics.smu.edu.sg', '21 Oct 2022', 123123, 'Zoo'),
        createData('amelia.tay.2020@business.smu.edu.sg', '21 Oct 2022', 123123, 'Zoo'),
    ]

    return rows
}

export default ReturnPassData