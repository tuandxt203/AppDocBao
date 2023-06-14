
import { Modal, View, StyleSheet, Text, Button ,TextInput,Image, TouchableOpacity, } from "react-native";
import React, { useState , useEffect} from 'react'
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import DropDownPicker from 'react-native-dropdown-picker';




const AddBaiViet =(props)=>{
    
    console.log("admin Add:"+props.roleFromHome? true : false);
    const [showModalDialog, setshowModalDialog] = useState(false);
    const [title, settitle] = useState('');
    const [content, setcontent] = useState('');
    const [author, setauthor] = useState('');
    const [value, setvalue] = useState(null);
    const [items, setItems] = useState([]);
    const [open, setOpen] = useState(false);

    const [img_source, setimg_source] = useState(null);
    const [img_base64, setiimg_base64] = useState(null)
    const addSP=()=>{
            let obj = {
                title:title,
                content:content,
                author:author,
                image:img_base64,
                catId:value,
                
            }
            let apii="http://192.168.31.108:3000/news"
            
            fetch(apii, {
                method: 'POST', 
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    obj,
                )
              })
              .then ((res)=>{
                  console.log(res);
                
                  if(res.status==201){
                    
                    alert("Thêm thành công");
                    setshowModalDialog(false);

                
                  }else alert('thất bại')
              })
                .catch((err) =>{console.log(err);})
        }
// ảnh
    


const pickImage = async () => {
         
    // Đọc ảnh từ thư viện thì không cần khai báo quyền
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [3, 5], // khung view cắt ảnh 
        quality: 1,
    });


    console.log(result);


    if (!result.canceled) {
        setimg_source(result.assets[0].uri);
        // chuyển ảnh thành base64 để upload lên json
        let _uri = result.assets[0].uri;  // địa chỉ file ảnh đã chọn
        let file_ext = _uri.substring(_uri.lastIndexOf('.') + 1); // lấy đuôi file


        FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: 'base64' })
            .then((res) => {
            // phải nối chuỗi với tiền tố data image
                setiimg_base64("data:image/" + file_ext + ";base64," + res); 
                console.log("link ảnh :"+img_base64);
            // upload ảnh lên api thì dùng PUT có thể viết ở đây
                
            });


    }


}
const PostNew=()=>{
    
    
    setshowModalDialog(props.roleFromHome);
    
     setiimg_base64(null);
     setcontent('');
     setauthor('');
     settitle('');
}
useEffect(()=>{
    let api_cat ='http://192.168.31.108:3000/cats';
    fetch(api_cat)
    .then ((ress)=>{
      return ress.json();
    })
    .then(async(res_json)=>{
      let arr_item_dropdown = res_json.map((item, index, arr)=>{
        return {label:item.name,value:item.id};
      });
      setItems(arr_item_dropdown);
    })
   },[])



    return(
        <View >

            <Modal visible={showModalDialog}
            transparent={true}
            animationType="fade"
            onRequestClose={
                ()=>{
                    //xảy ra khi bấm nút back trên điện thoại
                    setshowModalDialog(false);
                }
            }>
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                   
                <View style={st.khungDialog}>
                    <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                        <Text style={{marginLeft: 100, color:'#FF6666', fontSize:20,marginBottom: 10}}>POST</Text>
                        <Text style={{borderWidth:0.5, height:15, fontSize:10,color:'#808080',marginTop:5}} onPress={()=>setshowModalDialog(false)}>Cancel</Text>
                        
                    </View>
                    
                    {/* thể loại */}
                    <Text>Categorys</Text>
                        <View style={st.dropDown}>
                        <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setvalue}
                        setItems={setItems}
                        /> 
                        </View>
                    
                    <View>
                        <Text>Title</Text>
                        <TextInput placeholder="Nhập tiêu đề" onChangeText={(txt)=> settitle(txt)} style={st.nhap}/>
                    </View>
                    <View>
                        <Text>Content</Text>
                        <TextInput placeholder="Nhập nội dung" onChangeText={(txt)=> setcontent(txt)} style={st.nhapContent}/>
                    </View>
                    <View>
                        <Text>Author</Text>
                        <TextInput placeholder="Tác giả" onChangeText={(txt)=> setauthor(txt)} style={st.nhap}/>
                    </View>
                    
                    
                    
                    {/* {img_source && <Image source={{ uri: img_source }} style={{ width: 200, height: 200 }} />} */}
                   
                    {img_base64 && <Image source={{ uri: img_base64 }} style={{ width: 250, height: 150, margin: 10}} />}
                   
                   <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:20}}>
                    <TouchableOpacity onPress={pickImage} style={{width:'40%',height:30, backgroundColor:'#999999', justifyContent:'center', alignItems:'center', borderRadius:10}} >
                            <Text>Picture</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={addSP} style={{width:'40%',height:30, backgroundColor:'#008080', justifyContent:'center', alignItems:'center', borderRadius:10}}>
                            <Text>Save</Text>
                        </TouchableOpacity>
                   </View>
                   
                </View>
                </View>
                
            </Modal>
            {/* <Button title="Post News" onPress={()=> {setshowModalDialog(true)}}/> */}
            <TouchableOpacity  onPress={PostNew}>
                    <Text>Post News</Text>
                </TouchableOpacity>

        </View>
    );
}
export default AddBaiViet;

const st = StyleSheet.create({
    khungDialog:{
        backgroundColor:'#DDDDDD',
        borderRadius:10,
        padding:20,
        width:'80%'

    },
    nhap: {
        borderWidth:2, 
        padding:2,
        margin:5,
        borderColor:'cyan',
        borderRadius:5,
        backgroundColor: 'white',
    },
    nhapContent: {
        borderWidth:2, 
        padding:2,
        margin:5,
        borderColor:'cyan',
        borderRadius:5,
        backgroundColor: 'white',
        minHeight:100,
        
    },
    nutbamAdd:{
        
        backgroundColor:'yellow',
        width:'50%',
        justifyContent: 'center',
        alignItems:'center'
  },
  dropDown:{
    width:250,
    
    zIndex:100,
    elevation: 100
  },
})