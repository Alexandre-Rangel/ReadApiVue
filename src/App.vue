<template>
	<div id="app" class="container">
		<h1>Front da API {{produto.brand}} </h1>
		<b-alert show dismissible v-for="mensagem in mensagens" :key="mensagem.texto" :variant="mensagem.tipo">{{
		mensagem.texto }}</b-alert>
		<b-card>
			<b-form-group label="Produto:">
				<b-form-input type="text" size="lg" v-model="produto.name" placeholder="Informe o Nome do Produto">
				</b-form-input>
			</b-form-group>
			<b-form-group label="Descrição:">
				<b-form-input type="text" size="lg" v-model="produto.description" placeholder="Informe a Descrição">
				</b-form-input>
			</b-form-group>

			<div class="row">
				<div class="col-md-6">
					<b-form-group label="Tensão:">
						<input size="md" 
							oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
							type="number" maxlength="3" v-model="produto.voltage" placeholder="Informe a Tensão" />
					</b-form-group>
				</div>
				<div class="col-md-6">
					<b-form-group label="Marca:">
						<b-form-select type="text" size="md" v-model="produto.brand" :options="marcas">
						</b-form-select>
					</b-form-group>
				</div>
			</div>

			<hr>
			<b-button @click="salvar" size="lg" variant="primary"> Salvar </b-button>
			<b-button @click="obterProdutos" size="lg" variant="success" class="ml-2">Obter Produtos</b-button>

		</b-card>

		<table class="table">
			<thead>
				<tr>
					<th>#</th>
					<th>Nome</th>
					<th>Descrição</th>
					<th>Tensão</th>
					<th>Marca</th>
					<th>Ação</th>
				</tr>
			</thead>
			<tbody>

				<tr v-for="(item, key) in produto.data" :key="item.key">
					<td class="font-weight-bold">
						{{ item.id }}
					</td>
					<td class="font-weight-bold">
						{{ item.name }}
					</td>
					<td class="font-weight-bold">
						{{ item.description }}
					</td>
					<td class="font-weight-bold">
						{{ item.voltage }}
					</td>
					<td class="font-weight-bold">
						{{ item.brand }}
					</td>
					<td class="font-weight-bold">
						<b-button variant="warning" size="lg" @click="alterar(key,item.id )">Alterar</b-button>
						<b-button variant="danger" size="lg" class="ml-2" @click="excluir(item.id)">Excluir</b-button>
					</td>

				</tr>
			</tbody>
		</table>

	</div>
</template>

<script>

export default {
	data() {
		return {
			produto: {
				name: '',
				description: '',
				voltage: '',
				brand: ''
			},
			mensagens: [],
			id: null,
			key: null,
			marcas: [
				{ value: "Electrolux", text: "Electrolux" },
				{ value: "Brastemp", text: "Brastemp" },
				{ value: "Fischer", text: "Fischer" },
				{ value: "Samsung", text: "Samsung" },
				{ value: "LG", text: "LG" },
			],
		}
	},
	methods: {
		limpar() {
			this.produto.name = ''
			this.produto.description = ''
			this.produto.voltage = ''
			this.produto.brand = ''
			this.id = null
			this.key = null
			this.mensagens = []
		},
		alterar(key, id) {
			this.key = key
			this.id = id
			this.produto = this.produto.data[key];

		},
		excluir(id) {
			this.$http.delete(`${id}`)
			.then((data)  => {
				this.limpar();
				window.location.reload();
				})
				.catch(err => {
					this.limpar()
					this.mensagens.push({
						texto: 'Problema para excluir!',
						tipo: 'danger'
					})
				})
		},
		carregar(id) {
			this.id = id
			this.produto = { ...this.produto[id] }
		},
		validar() {

			if (!this.produto.name) {
				this.mensagens.push({
						texto: 'O nome é obrigatório!',
						tipo: 'danger'
					})
			}
			if (!this.produto.description) {
				this.mensagens.push({
						texto: 'A Descrição é obrigatória',
						tipo: 'danger'
					})
			}
			if (!this.produto.voltage) {
				this.mensagens.push({
						texto: 'É obrigatório informar a tensão do equipamento',
						tipo: 'danger'
					})
			}
			if (!this.produto.brand) {
				this.mensagens.push({
						texto: 'A Marca é obrigatória',
						tipo: 'danger'
					})
			}
			if (this.mensagens.length > 0) {
				return false;
			}
			return true
		},
		salvar() {
			this.mensagens = []
			let validar = this.validar()		

			if (validar)
			{
				console.log('entrou')
				const metodo = this.id ? 'put' : 'post'
				const finalUrl = this.id ? `/${this.id}` : '/'
				this.$http[metodo](`${finalUrl}`,
					{
						name: this.produto.name,
						description: this.produto.description,
						voltage: this.produto.voltage,
						brand: this.produto.brand
					})
					.then((data)  => {
				
						this.limpar()
						this.mensagens.push({
							texto: data.data.data.msg,
							tipo: 'success'
						})
					})
					.catch((data)  => {
						this.limpar()
						this.mensagens.push({
							texto: 'Problema para Salvar!',
							tipo: 'danger'
						})
					})
			}
		},
		obterProdutos() {
			this.$http.get().then(res => {
				this.produto = res.data
			})
		}
	}
}
</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	font-size: 1.5rem;
}

#app h1 {
	text-align: center;
	margin: 50px;
}
</style>
