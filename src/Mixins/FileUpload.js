import axios from 'axios'
export const FileUpload = {
    data(){
        return {
            file:null,
            file2:null,
            fileError: null,
            NewImage:{
                Title: "Testy"
            },
            rand : 10,
        }
    },
    computed: {
        imgRand(){
            return this.imgRdn();
        },
    },
    methods:{
        imgRdn(){
            this.rand = this.rand + Math.random();
            return this.rand
        },
       async AddNewFile(DataImage , file){   
            this.fileError = '';

            if(file != null){

                let formData = new FormData();
                formData.append('file', file);
                formData.append('data', JSON.stringify(DataImage));
            

                if(file['type'] === 'image/jpeg' || file['type'] === 'image/png' || file['type'] === 'image/png'){
                    return   await axios.post('http://localhost:5000/api/Upload/',formData,{headers: {
                        authorization: localStorage.getItem('token'),
                        }} ).then(res => {
                            //if successfull
                            if(res.status === 200){
                                console.log("ADDNEWFILE RES: ",DataImage,res);
                            }
                            this.error = '';
                        },err => {
                            console.log("ADDNEWFILE ERR: ",err.response);
                            this.error = err.response.data.errors.Name[0];
                            
                        })
                }
            }
        },
        async UpdateFile(img , file){
            
            this.fileError = '';
            let newimg = img;

            if(file != null){

                let formData = new FormData();
                formData.append('file', file);
                formData.append('data', JSON.stringify(newimg));

                if(file['type'] === 'image/jpeg' || file['type'] === 'image/png' || file['type'] === 'image/jpeg'){
                    return  await axios.put('http://localhost:5000/api/Upload/',formData,{headers: {
                        authorization: localStorage.getItem('token'),
                        }} ).then(res => {
                            //if successfull
                            if(res.status === 200){
                                console.log("UPDATEFILE RES:",res);
                            }
                            this.error = '';
                        },err => {
                            console.log("ADDNEWFILE ERR: ",err.response);
                            this.error = err.response.data.errors.Name[0];
                        })
                }
            }
        },
        handleFileUpload(){
            this.file = this.$refs.file.files[0];
        },



    }
}

